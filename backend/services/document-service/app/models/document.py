from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func

from app.database.session import Base


class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)

    owner_id = Column(Integer, index=True, nullable=False)

    original_filename = Column(String(255), nullable=False)
    stored_filename = Column(String(255), unique=True, nullable=False)
    content_type = Column(String(100), nullable=False)

    file_size = Column(Integer, nullable=False)
    sha256_hash = Column(String(64), nullable=False)

    status = Column(String(30), nullable=False, default="uploaded")

    encrypted_path = Column(String(500), nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())