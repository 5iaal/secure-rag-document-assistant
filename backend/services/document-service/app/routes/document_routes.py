from fastapi import APIRouter, Depends, File, HTTPException, Request, UploadFile, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.document import DocumentResponse
from app.services.audit_client import send_audit_event
from app.services.document_service import (
    upload_document,
    list_my_documents,
    get_document_by_id,
)
from app.services.queue_service import publish_document_job
from app.utils.dependencies import get_current_user_payload
from app.utils.file_security import verify_file_integrity

router = APIRouter(prefix="/documents", tags=["Documents"])


@router.get("/health")
def health_check():
    return {"service": "document-service", "status": "healthy"}


@router.post("/upload", response_model=DocumentResponse)
async def upload_pdf(
    request: Request,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    user_payload: dict = Depends(get_current_user_payload),
):
    ip_address = request.client.host if request.client else None

    try:
        document = upload_document(db, file, user_payload)

        await publish_document_job(
            {
                "document_id": document.id,
                "owner_id": document.owner_id,
                "encrypted_path": document.encrypted_path,
                "sha256_hash": document.sha256_hash,
                "original_filename": document.original_filename,
            }
        )

        send_audit_event(
            service_name="document-service",
            action="DOCUMENT_UPLOAD_SUCCESS",
            status="success",
            user_id=user_payload["user_id"],
            user_email=user_payload.get("email"),
            ip_address=ip_address,
            details=f"Uploaded document {document.original_filename} with id {document.id}",
        )

        return document

    except HTTPException as exc:
        send_audit_event(
            service_name="document-service",
            action="DOCUMENT_UPLOAD_FAILED",
            status="failed",
            user_id=user_payload.get("user_id"),
            user_email=user_payload.get("email"),
            ip_address=ip_address,
            details=str(exc.detail),
        )
        raise exc


@router.get("/me", response_model=list[DocumentResponse])
def my_documents(
    db: Session = Depends(get_db),
    user_payload: dict = Depends(get_current_user_payload),
):
    return list_my_documents(db, user_payload)


@router.get("/{document_id}/verify")
def verify_document_integrity(
    document_id: int,
    request: Request,
    db: Session = Depends(get_db),
    user_payload: dict = Depends(get_current_user_payload),
):
    ip_address = request.client.host if request.client else None

    document = get_document_by_id(db, document_id, user_payload)

    if not document:
        send_audit_event(
            service_name="document-service",
            action="DOCUMENT_INTEGRITY_VERIFY_FAILED",
            status="failed",
            user_id=user_payload.get("user_id"),
            user_email=user_payload.get("email"),
            ip_address=ip_address,
            details=f"Document not found: {document_id}",
        )

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found",
        )

    is_valid = verify_file_integrity(
        document.encrypted_path,
        document.sha256_hash,
    )

    send_audit_event(
        service_name="document-service",
        action="DOCUMENT_INTEGRITY_VERIFIED",
        status="success" if is_valid else "failed",
        user_id=user_payload["user_id"],
        user_email=user_payload.get("email"),
        ip_address=ip_address,
        details=f"Integrity check for document {document.id}: {is_valid}",
    )

    return {
        "document_id": document.id,
        "filename": document.original_filename,
        "integrity_valid": is_valid,
        "expected_sha256": document.sha256_hash,
    }