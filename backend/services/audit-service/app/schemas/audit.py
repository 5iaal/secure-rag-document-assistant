from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class AuditLogCreate(BaseModel):
    user_id: Optional[int] = None
    user_email: Optional[str] = None
    service_name: str
    action: str
    status: str
    ip_address: Optional[str] = None
    details: Optional[str] = None


class AuditLogResponse(BaseModel):
    id: int
    user_id: Optional[int]
    user_email: Optional[str]
    service_name: str
    action: str
    status: str
    ip_address: Optional[str]
    details: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True