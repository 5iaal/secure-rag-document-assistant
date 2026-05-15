from sqlalchemy import Column, Integer, String, DateTime, Text
from sqlalchemy.sql import func

from app.database.session import Base


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)

    request_id = Column(String(120), nullable=True, index=True)

    user_id = Column(Integer, nullable=True, index=True)
    user_email = Column(String(255), nullable=True)

    service_name = Column(String(80), nullable=False)
    action = Column(String(120), nullable=False)

    status = Column(String(30), nullable=False)
    ip_address = Column(String(80), nullable=True)

    details = Column(Text, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())