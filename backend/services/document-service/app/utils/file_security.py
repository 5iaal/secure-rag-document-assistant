import hashlib
import os
import re
import uuid
from pathlib import Path

from cryptography.fernet import Fernet
from fastapi import HTTPException, UploadFile, status

from app.core.config import settings

BASE_STORAGE_DIR = Path("storage/encrypted")
BASE_STORAGE_DIR.mkdir(parents=True, exist_ok=True)

ALLOWED_CONTENT_TYPES = {"application/pdf"}
BLOCKED_EXTENSIONS = {".exe", ".php", ".js", ".bat", ".sh"}


def sanitize_filename(filename: str) -> str:
    name = Path(filename).name
    name = re.sub(r"[^a-zA-Z0-9._-]", "_", name)
    return name[:180]


def validate_pdf_file(file: UploadFile, file_bytes: bytes) -> None:
    if not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Missing filename",
        )

    ext = Path(file.filename).suffix.lower()

    if ext in BLOCKED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Blocked file extension",
        )

    if ext != ".pdf":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF files are allowed",
        )

    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid MIME type. Only application/pdf is allowed",
        )

    max_size = settings.max_file_size_mb * 1024 * 1024

    if len(file_bytes) > max_size:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File size exceeds {settings.max_file_size_mb}MB limit",
        )

    if not file_bytes.startswith(b"%PDF"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid PDF signature",
        )


def calculate_sha256(file_bytes: bytes) -> str:
    return hashlib.sha256(file_bytes).hexdigest()


def encrypt_file(file_bytes: bytes) -> tuple[str, str]:
    fernet = Fernet(settings.fernet_key.encode())

    encrypted_bytes = fernet.encrypt(file_bytes)

    stored_filename = f"{uuid.uuid4().hex}.pdf.enc"
    encrypted_path = BASE_STORAGE_DIR / stored_filename

    with open(encrypted_path, "wb") as f:
        f.write(encrypted_bytes)

    return stored_filename, str(encrypted_path)


def decrypt_file(encrypted_path: str) -> bytes:
    fernet = Fernet(settings.fernet_key.encode())

    if not os.path.exists(encrypted_path):
        raise FileNotFoundError("Encrypted file not found")

    with open(encrypted_path, "rb") as f:
        encrypted_bytes = f.read()

    return fernet.decrypt(encrypted_bytes)


def verify_file_integrity(encrypted_path: str, expected_hash: str) -> bool:
    if not os.path.exists(encrypted_path):
        return False

    decrypted_bytes = decrypt_file(encrypted_path)
    current_hash = calculate_sha256(decrypted_bytes)

    return current_hash == expected_hash


def delete_encrypted_file(encrypted_path: str) -> bool:
    if not encrypted_path:
        return False

    if not os.path.exists(encrypted_path):
        return False

    os.remove(encrypted_path)
    return True