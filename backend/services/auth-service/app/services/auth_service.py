from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.user import User
from app.schemas.auth import RegisterRequest, LoginRequest
from app.services.audit_client import send_audit_event
from app.utils.security import hash_password, verify_password, create_access_token


def register_user(
    db: Session,
    payload: RegisterRequest,
    ip_address: str | None = None,
) -> User:
    existing_user = db.query(User).filter(User.email == payload.email).first()

    if existing_user:
        send_audit_event(
            service_name="auth-service",
            action="REGISTER_FAILED",
            status="failed",
            user_email=payload.email,
            ip_address=ip_address,
            details="Email already registered",
        )

        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered",
        )

    user = User(
        full_name=payload.full_name,
        email=payload.email,
        hashed_password=hash_password(payload.password),
        role="user",
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    send_audit_event(
        service_name="auth-service",
        action="REGISTER_SUCCESS",
        status="success",
        user_id=user.id,
        user_email=user.email,
        ip_address=ip_address,
        details="User registered successfully",
    )

    return user


def login_user(
    db: Session,
    payload: LoginRequest,
    ip_address: str | None = None,
) -> dict:
    user = db.query(User).filter(User.email == payload.email).first()

    if not user or not verify_password(payload.password, user.hashed_password):
        send_audit_event(
            service_name="auth-service",
            action="LOGIN_FAILED",
            status="failed",
            user_email=payload.email,
            ip_address=ip_address,
            details="Invalid email or password",
        )

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    if not user.is_active:
        send_audit_event(
            service_name="auth-service",
            action="LOGIN_BLOCKED",
            status="failed",
            user_id=user.id,
            user_email=user.email,
            ip_address=ip_address,
            details="User account is disabled",
        )

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is disabled",
        )

    token = create_access_token(
        {
            "sub": str(user.id),
            "email": user.email,
            "role": user.role,
        }
    )

    send_audit_event(
        service_name="auth-service",
        action="LOGIN_SUCCESS",
        status="success",
        user_id=user.id,
        user_email=user.email,
        ip_address=ip_address,
        details="User logged in successfully",
    )

    return {
        "access_token": token,
        "role": user.role,
        "user_id": user.id,
    }