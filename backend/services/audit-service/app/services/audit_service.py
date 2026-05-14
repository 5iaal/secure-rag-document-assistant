from sqlalchemy.orm import Session

from app.models.audit_log import AuditLog
from app.schemas.audit import AuditLogCreate


def create_audit_log(db: Session, payload: AuditLogCreate) -> AuditLog:
    log = AuditLog(**payload.model_dump())

    db.add(log)
    db.commit()
    db.refresh(log)

    return log


def list_audit_logs(db: Session, limit: int = 100) -> list[AuditLog]:
    return (
        db.query(AuditLog)
        .order_by(AuditLog.created_at.desc())
        .limit(limit)
        .all()
    )