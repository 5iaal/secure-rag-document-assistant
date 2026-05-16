from fastapi import Depends, HTTPException, Request, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt

from app.core.config import settings
from app.services.audit_client import send_audit_event

security = HTTPBearer()


def get_current_user_payload(
    request: Request,
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> dict:
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
        role = payload.get("role")

        if user_id is None or role is None:
            send_audit_event(
                service_name="document-service",
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

        return {
            "user_id": int(user_id),
            "email": payload.get("email"),
            "role": role,
        }

    except JWTError:
        send_audit_event(
            service_name="document-service",
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