import secrets

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
    request_id: str | None = None,
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
            request_id=request_id,
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
        request_id=request_id,
    )

    return user


def login_user(
    db: Session,
    payload: LoginRequest,
    ip_address: str | None = None,
    request_id: str | None = None,
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
            request_id=request_id,
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
            request_id=request_id,
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
        request_id=request_id,
    )

    return {
        "access_token": token,
        "role": user.role,
        "user_id": user.id,
    }


def get_or_create_oauth_user(
    db: Session,
    email: str,
    full_name: str,
    provider: str,
    ip_address: str | None = None,
    request_id: str | None = None,
) -> dict:
    user = db.query(User).filter(User.email == email).first()

    if not user:
        random_password = secrets.token_urlsafe(32)

        user = User(
            full_name=full_name or email.split("@")[0],
            email=email,
            hashed_password=hash_password(random_password),
            role="user",
            is_active=True,
        )

        db.add(user)
        db.commit()
        db.refresh(user)

        send_audit_event(
            service_name="auth-service",
            action=f"{provider.upper()}_OAUTH_REGISTER_SUCCESS",
            status="success",
            user_id=user.id,
            user_email=user.email,
            ip_address=ip_address,
            details=f"New OAuth user created via {provider}",
            request_id=request_id,
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
        action=f"{provider.upper()}_OAUTH_LOGIN_SUCCESS",
        status="success",
        user_id=user.id,
        user_email=user.email,
        ip_address=ip_address,
        details=f"OAuth login via {provider}",
        request_id=request_id,
    )

    return {
        "access_token": token,
        "role": user.role,
        "user_id": user.id,
    }