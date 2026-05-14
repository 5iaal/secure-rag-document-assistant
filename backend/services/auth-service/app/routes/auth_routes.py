from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.user import User
from app.schemas.auth import (
    RegisterRequest,
    LoginRequest,
    TokenResponse,
    UserResponse,
)
from app.services.auth_service import register_user, login_user
from app.utils.dependencies import get_current_user, require_admin

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.get("/health")
def health_check():
    return {"service": "auth-service", "status": "healthy"}


@router.post("/register", response_model=UserResponse)
def register(
    payload: RegisterRequest,
    request: Request,
    db: Session = Depends(get_db),
):
    return register_user(
        db=db,
        payload=payload,
        ip_address=request.client.host if request.client else None,
    )


@router.post("/login", response_model=TokenResponse)
def login(
    payload: LoginRequest,
    request: Request,
    db: Session = Depends(get_db),
):
    return login_user(
        db=db,
        payload=payload,
        ip_address=request.client.host if request.client else None,
    )


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.get("/admin-only")
def admin_only(current_user: User = Depends(require_admin)):
    return {
        "message": "Welcome admin",
        "user_id": current_user.id,
        "email": current_user.email,
        "role": current_user.role,
    }