import httpx

from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.core.config import settings
from app.database.session import get_db
from app.models.user import User
from app.schemas.auth import (
    RegisterRequest,
    LoginRequest,
    TokenResponse,
    UserResponse,
)
from app.services.auth_service import (
    register_user,
    login_user,
    get_or_create_oauth_user,
)
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
    request_id=request.headers.get("X-Request-ID"),
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
    request_id=request.headers.get("X-Request-ID"),
)


@router.get("/github/login")
def github_login():
    if not settings.github_client_id:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="GitHub OAuth is not configured",
        )

    github_auth_url = (
        "https://github.com/login/oauth/authorize"
        f"?client_id={settings.github_client_id}"
        "&scope=user:email"
        "&prompt=select_account"
    )

    return RedirectResponse(github_auth_url)


@router.get("/github/callback")
def github_callback(
    code: str,
    request: Request,
    db: Session = Depends(get_db),
):
    ip_address = request.client.host if request.client else None

    token_response = httpx.post(
        "https://github.com/login/oauth/access_token",
        data={
            "client_id": settings.github_client_id,
            "client_secret": settings.github_client_secret,
            "code": code,
        },
        headers={"Accept": "application/json"},
        timeout=20,
    )

    token_data = token_response.json()
    access_token = token_data.get("access_token")

    if not access_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="GitHub OAuth token exchange failed",
        )

    user_response = httpx.get(
        "https://api.github.com/user",
        headers={"Authorization": f"Bearer {access_token}"},
        timeout=20,
    )

    github_user = user_response.json()

    email = github_user.get("email")
    full_name = github_user.get("name") or github_user.get("login")

    if not email:
        emails_response = httpx.get(
            "https://api.github.com/user/emails",
            headers={"Authorization": f"Bearer {access_token}"},
            timeout=20,
        )

        emails = emails_response.json()

        primary_email = next(
            (
                item["email"]
                for item in emails
                if item.get("primary") and item.get("verified")
            ),
            None,
        )

        email = primary_email

    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Could not retrieve verified GitHub email",
        )

    jwt_data = get_or_create_oauth_user(
        db=db,
        email=email,
        full_name=full_name,
        provider="github",
        ip_address=ip_address,
    )

    redirect_url = (
        f"{settings.frontend_url}/oauth/callback"
        f"?token={jwt_data['access_token']}"
        f"&role={jwt_data['role']}"
        f"&user_id={jwt_data['user_id']}"
    )

    return RedirectResponse(redirect_url)


@router.get("/google/login")
def google_login():
    if not settings.google_client_id:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Google OAuth is not configured",
        )

    google_auth_url = (
        "https://accounts.google.com/o/oauth2/v2/auth"
        f"?client_id={settings.google_client_id}"
        "&redirect_uri=https://localhost/api/auth/google/callback"
        "&response_type=code"
        "&scope=openid%20email%20profile"
        "&access_type=offline"
        "&prompt=select_account"
    )

    return RedirectResponse(google_auth_url)


@router.get("/google/callback")
def google_callback(
    code: str,
    request: Request,
    db: Session = Depends(get_db),
):
    ip_address = request.client.host if request.client else None

    token_response = httpx.post(
        "https://oauth2.googleapis.com/token",
        data={
            "client_id": settings.google_client_id,
            "client_secret": settings.google_client_secret,
            "code": code,
            "grant_type": "authorization_code",
            "redirect_uri": "https://localhost/api/auth/google/callback",
        },
        headers={"Accept": "application/json"},
        timeout=20,
    )

    token_data = token_response.json()
    access_token = token_data.get("access_token")

    if not access_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Google OAuth token exchange failed",
        )

    user_response = httpx.get(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        headers={"Authorization": f"Bearer {access_token}"},
        timeout=20,
    )

    google_user = user_response.json()

    email = google_user.get("email")
    full_name = google_user.get("name") or email

    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Could not retrieve Google email",
        )

    jwt_data = get_or_create_oauth_user(
        db=db,
        email=email,
        full_name=full_name,
        provider="google",
        ip_address=ip_address,
    )

    redirect_url = (
        f"{settings.frontend_url}/oauth/callback"
        f"?token={jwt_data['access_token']}"
        f"&role={jwt_data['role']}"
        f"&user_id={jwt_data['user_id']}"
    )

    return RedirectResponse(redirect_url)


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.get("/admin/users", response_model=list[UserResponse])
def list_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    return db.query(User).order_by(User.created_at.desc()).all()    


@router.get("/admin/stats")
def admin_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    total_users = db.execute(
        text("SELECT COUNT(*) FROM users")
    ).scalar() or 0

    total_documents = db.execute(
        text("SELECT COUNT(*) FROM documents")
    ).scalar() or 0

    indexed_documents = db.execute(
        text("SELECT COUNT(*) FROM documents WHERE status = 'indexed'")
    ).scalar() or 0

    processed_jobs = db.execute(
        text("SELECT COUNT(*) FROM documents WHERE status IN ('processed', 'indexed')")
    ).scalar() or 0

    storage_used = db.execute(
        text("SELECT COALESCE(SUM(file_size), 0) FROM documents")
    ).scalar() or 0

    failed_logins = db.execute(
        text("SELECT COUNT(*) FROM audit_logs WHERE action = 'LOGIN_FAILED'")
    ).scalar() or 0

    ai_queries = db.execute(
        text("SELECT COUNT(*) FROM audit_logs WHERE action LIKE 'RAG_QUERY%'")
    ).scalar() or 0

    audit_events = db.execute(
        text("SELECT COUNT(*) FROM audit_logs")
    ).scalar() or 0

    failed_uploads = db.execute(
        text("SELECT COUNT(*) FROM audit_logs WHERE action = 'DOCUMENT_UPLOAD_FAILED'")
    ).scalar() or 0

    return {
        "total_users": total_users,
        "total_documents": total_documents,
        "indexed_documents": indexed_documents,
        "processed_jobs": processed_jobs,
        "storage_used_bytes": int(storage_used),
        "failed_logins": failed_logins,
        "ai_queries": ai_queries,
        "audit_events": audit_events,
        "failed_uploads": failed_uploads,
    }
    


@router.get("/admin-only")
def admin_only(current_user: User = Depends(require_admin)):
    return {
        "message": "Welcome admin",
        "user_id": current_user.id,
        "email": current_user.email,
        "role": current_user.role,
    }