from fastapi import UploadFile
from sqlalchemy.orm import Session

from app.models.document import Document
from app.utils.file_security import (
    sanitize_filename,
    validate_pdf_file,
    calculate_sha256,
    encrypt_file,
)


def upload_document(
    db: Session,
    file: UploadFile,
    user_payload: dict,
) -> Document:
    file_bytes = file.file.read()

    validate_pdf_file(file, file_bytes)

    clean_filename = sanitize_filename(file.filename)
    sha256_hash = calculate_sha256(file_bytes)

    stored_filename, encrypted_path = encrypt_file(file_bytes)

    document = Document(
        owner_id=user_payload["user_id"],
        original_filename=clean_filename,
        stored_filename=stored_filename,
        content_type=file.content_type,
        file_size=len(file_bytes),
        sha256_hash=sha256_hash,
        status="uploaded",
        encrypted_path=encrypted_path,
    )

    db.add(document)
    db.commit()
    db.refresh(document)

    return document


def list_my_documents(db: Session, user_payload: dict) -> list[Document]:
    return (
        db.query(Document)
        .filter(Document.owner_id == user_payload["user_id"])
        .order_by(Document.created_at.desc())
        .all()
    )


def get_document_by_id(db: Session, document_id: int, user_payload: dict) -> Document | None:
    query = db.query(Document).filter(Document.id == document_id)

    if user_payload["role"] != "admin":
        query = query.filter(Document.owner_id == user_payload["user_id"])

    return query.first()