from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.audit import AuditLogCreate, AuditLogResponse
from app.services.audit_service import create_audit_log, list_audit_logs
from app.utils.security import verify_internal_api_key

router = APIRouter(prefix="/audit", tags=["Audit"])


@router.get("/health")
def health_check():
    return {"service": "audit-service", "status": "healthy"}


@router.post(
    "/events",
    response_model=AuditLogResponse,
    dependencies=[Depends(verify_internal_api_key)],
)
def create_event(payload: AuditLogCreate, db: Session = Depends(get_db)):
    return create_audit_log(db, payload)


@router.get("/events", response_model=list[AuditLogResponse])
def get_events(
    limit: int = Query(default=100, ge=1, le=500),
    db: Session = Depends(get_db),
):
    return list_audit_logs(db, limit)