from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.document import DocumentResponse
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
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    user_payload: dict = Depends(get_current_user_payload),
):
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

    return document


@router.get("/me", response_model=list[DocumentResponse])
def my_documents(
    db: Session = Depends(get_db),
    user_payload: dict = Depends(get_current_user_payload),
):
    return list_my_documents(db, user_payload)


@router.get("/{document_id}/verify")
def verify_document_integrity(
    document_id: int,
    db: Session = Depends(get_db),
    user_payload: dict = Depends(get_current_user_payload),
):
    document = get_document_by_id(db, document_id, user_payload)

    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found",
        )

    is_valid = verify_file_integrity(
        document.encrypted_path,
        document.sha256_hash,
    )

    return {
        "document_id": document.id,
        "filename": document.original_filename,
        "integrity_valid": is_valid,
        "expected_sha256": document.sha256_hash,
    }