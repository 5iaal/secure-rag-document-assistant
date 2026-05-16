import httpx

from app.core.config import settings


def send_audit_event(
    service_name: str,
    action: str,
    status: str,
    user_id: int | None = None,
    user_email: str | None = None,
    ip_address: str | None = None,
    details: str | None = None,
    request_id: str | None = None,
) -> None:
    payload = {
        "request_id": request_id,
        "user_id": user_id,
        "user_email": user_email,
        "service_name": service_name,
        "action": action,
        "status": status,
        "ip_address": ip_address,
        "details": details,
    }

    headers = {
        "X-Internal-API-Key": settings.internal_api_key,
    }

    if request_id:
        headers["X-Request-ID"] = request_id

    try:
        with httpx.Client(timeout=3) as client:
            client.post(
                settings.audit_service_url,
                json=payload,
                headers=headers,
            )
    except Exception as exc:
        print(f"[AUDIT ERROR] Failed to send audit event: {exc}")