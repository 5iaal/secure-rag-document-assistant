import hashlib
import os
import time

from cryptography.fernet import Fernet
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.document import Document


def calculate_sha256(file_bytes: bytes) -> str:
    return hashlib.sha256(file_bytes).hexdigest()


def update_document_status(db: Session, document_id: int, status: str) -> None:
    document = db.query(Document).filter(Document.id == document_id).first()

    if not document:
        print(f"[!] Document not found: {document_id}")
        return

    document.status = status
    db.commit()


def process_document_job(db: Session, job: dict) -> None:
    document_id = job["document_id"]
    encrypted_path = job["encrypted_path"]
    expected_hash = job["sha256_hash"]

    print(f"[+] Processing document job: {document_id}")

    update_document_status(db, document_id, "processing")

    if not os.path.exists(encrypted_path):
        print(f"[!] Encrypted file not found: {encrypted_path}")
        update_document_status(db, document_id, "failed")
        return

    fernet = Fernet(settings.fernet_key.encode())

    with open(encrypted_path, "rb") as f:
        encrypted_bytes = f.read()

    decrypted_bytes = fernet.decrypt(encrypted_bytes)

    current_hash = calculate_sha256(decrypted_bytes)

    if current_hash != expected_hash:
        print(f"[!] Integrity failed for document {document_id}")
        update_document_status(db, document_id, "integrity_failed")
        return

    # MVP simulation for now
    # Later: extract PDF text → chunk → embeddings → ChromaDB
    time.sleep(2)

    update_document_status(db, document_id, "processed")

    print(f"[✓] Document processed successfully: {document_id}")