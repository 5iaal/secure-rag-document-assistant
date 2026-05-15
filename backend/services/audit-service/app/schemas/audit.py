from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class AuditEventCreate(BaseModel):
    request_id: Optional[str] = None

    user_id: Optional[int] = None
    user_email: Optional[str] = None

    service_name: str
    action: str

    status: str
    ip_address: Optional[str] = None

    details: Optional[str] = None


class AuditEventResponse(BaseModel):
    id: int

    request_id: Optional[str] = None

    user_id: Optional[int] = None
    user_email: Optional[str] = None

    service_name: str
    action: str

    status: str
    ip_address: Optional[str] = None

    details: Optional[str] = None

    created_at: datetime

    class Config:
        from_attributes = True