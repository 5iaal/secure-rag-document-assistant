from fastapi import Depends, HTTPException, Request, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from app.core.config import settings
from app.database.session import get_db
from app.models.user import User
from app.services.audit_client import send_audit_event

security = HTTPBearer()


def get_current_user(
    request: Request,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
) -> User:
    token = credentials.credentials

    ip_address = request.client.host if request.client else None
    request_id = request.headers.get("X-Request-ID")

    try:
        payload = jwt.decode(
            token,
            settings.jwt_secret,
            algorithms=[settings.jwt_algorithm],
        )

        user_id = payload.get("sub")

        if user_id is None:
            send_audit_event(
                service_name="auth-service",
                action="AUTH_UNAUTHORIZED",
                status="failed",
                user_id=None,
                user_email=None,
                ip_address=ip_address,
                request_id=request_id,
                details="Invalid token payload",
            )

            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token payload",
            )

    except JWTError:
        send_audit_event(
            service_name="auth-service",
            action="AUTH_UNAUTHORIZED",
            status="failed",
            user_id=None,
            user_email=None,
            ip_address=ip_address,
            request_id=request_id,
            details="Invalid or expired token",
        )

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )

    user = db.query(User).filter(User.id == int(user_id)).first()

    if not user:
        send_audit_event(
            service_name="auth-service",
            action="AUTH_UNAUTHORIZED",
            status="failed",
            user_id=None,
            user_email=None,
            ip_address=ip_address,
            request_id=request_id,
            details=f"User not found for token user_id={user_id}",
        )

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )

    if not user.is_active:
        send_audit_event(
            service_name="auth-service",
            action="AUTH_FORBIDDEN",
            status="failed",
            user_id=user.id,
            user_email=user.email,
            ip_address=ip_address,
            request_id=request_id,
            details="Disabled user attempted access",
        )

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is disabled",
        )

    return user


def require_admin(
    request: Request,
    current_user: User = Depends(get_current_user),
) -> User:
    if current_user.role != "admin":
        ip_address = request.client.host if request.client else None
        request_id = request.headers.get("X-Request-ID")

        send_audit_event(
            service_name="auth-service",
            action="AUTH_FORBIDDEN_ADMIN",
            status="failed",
            user_id=current_user.id,
            user_email=current_user.email,
            ip_address=ip_address,
            request_id=request_id,
            details="Non-admin user attempted admin access",
        )

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )

    return current_user