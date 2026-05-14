import hashlib
import os

from cryptography.fernet import Fernet
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.document import Document
from app.services.text_extractor import extract_text_from_pdf, chunk_text
from app.services.vector_store import index_document_chunks


def calculate_sha256(file_bytes: bytes) -> str:
    return hashlib.sha256(file_bytes).hexdigest()


def update_document_status(db: Session, document_id: int, status: str) -> None:
    document = db.query(Document).filter(Document.id == document_id).first()

    if not document:
        print(f"[!] Document not found: {document_id}", flush=True)
        return

    document.status = status
    db.commit()


def process_document_job(db: Session, job: dict) -> None:
    document_id = job["document_id"]
    owner_id = job["owner_id"]
    encrypted_path = job["encrypted_path"]
    expected_hash = job["sha256_hash"]
    original_filename = job.get("original_filename", "unknown.pdf")

    print(f"[+] Processing document job: {document_id}", flush=True)

    update_document_status(db, document_id, "processing")

    if not os.path.exists(encrypted_path):
        print(f"[!] Encrypted file not found: {encrypted_path}", flush=True)
        update_document_status(db, document_id, "failed")
        return

    fernet = Fernet(settings.fernet_key.encode())

    with open(encrypted_path, "rb") as f:
        encrypted_bytes = f.read()

    decrypted_bytes = fernet.decrypt(encrypted_bytes)

    current_hash = calculate_sha256(decrypted_bytes)

    if current_hash != expected_hash:
        print(f"[!] Integrity failed for document {document_id}", flush=True)
        update_document_status(db, document_id, "integrity_failed")
        return

    text = extract_text_from_pdf(decrypted_bytes)

    if not text.strip():
        print(f"[!] No extractable text found in document {document_id}", flush=True)
        update_document_status(db, document_id, "no_text")
        return

    chunks = chunk_text(text)

    chunks_count = index_document_chunks(
        document_id=document_id,
        owner_id=owner_id,
        filename=original_filename,
        chunks=chunks,
    )

    update_document_status(db, document_id, "indexed")

    print(
        f"[✓] Document indexed successfully: {document_id}, chunks={chunks_count}",
        flush=True,
    )