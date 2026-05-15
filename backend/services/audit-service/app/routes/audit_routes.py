from fastapi import APIRouter, Depends, Query, Header
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.audit import AuditEventCreate, AuditEventResponse
from app.services.audit_service import create_audit_event, list_audit_events
from app.utils.security import verify_internal_api_key

router = APIRouter(prefix="/audit", tags=["Audit"])


@router.get("/health")
def health_check():
    return {"service": "audit-service", "status": "healthy"}


@router.post(
    "/events",
    response_model=AuditEventResponse,
    dependencies=[Depends(verify_internal_api_key)],
)
def create_event(
    payload: AuditEventCreate,
    db: Session = Depends(get_db),
    x_request_id: str | None = Header(default=None, alias="X-Request-ID"),
):
    if not payload.request_id and x_request_id:
        payload.request_id = x_request_id

    return create_audit_event(db, payload)


@router.get("/events", response_model=list[AuditEventResponse])
def get_events(
    limit: int = Query(default=100, ge=1, le=500),
    db: Session = Depends(get_db),
):
    return list_audit_events(db, limit)