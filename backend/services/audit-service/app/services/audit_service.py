from sqlalchemy.orm import Session

from app.models.audit_log import AuditLog
from app.schemas.audit import AuditEventCreate


def create_audit_event(
    db: Session,
    payload: AuditEventCreate,
) -> AuditLog:
    audit_log = AuditLog(
        request_id=payload.request_id,
        user_id=payload.user_id,
        user_email=payload.user_email,
        service_name=payload.service_name,
        action=payload.action,
        status=payload.status,
        ip_address=payload.ip_address,
        details=payload.details,
    )

    db.add(audit_log)
    db.commit()
    db.refresh(audit_log)

    return audit_log


def list_audit_events(
    db: Session,
    limit: int = 100,
) -> list[AuditLog]:
    return (
        db.query(AuditLog)
        .order_by(AuditLog.created_at.desc())
        .limit(limit)
        .all()
    )