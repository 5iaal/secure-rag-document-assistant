from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.user import User
from app.utils.security import hash_password


def seed_admin_user(db: Session) -> None:
    existing_admin = db.query(User).filter(User.email == settings.admin_email).first()

    if existing_admin:
        return

    admin_user = User(
        full_name=settings.admin_full_name,
        email=settings.admin_email,
        hashed_password=hash_password(settings.admin_password),
        role="admin",
        is_active=True,
    )

    db.add(admin_user)
    db.commit()