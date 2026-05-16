from fastapi import APIRouter, Depends, Request

from app.schemas.rag import AskRequest, AskResponse
from app.services.audit_client import send_audit_event
from app.services.rag_service import ask_question, extract_requested_filename
from app.utils.dependencies import get_current_user_payload

router = APIRouter(prefix="/rag", tags=["RAG"])


@router.get("/health")
def health_check():
    return {"service": "rag-service", "status": "healthy"}


@router.post("/ask", response_model=AskResponse)
def ask(
    payload: AskRequest,
    request: Request,
    user_payload: dict = Depends(get_current_user_payload),
):
    request_id = request.headers.get("X-Request-ID")
    ip_address = request.client.host if request.client else None
    requested_file = extract_requested_filename(payload.question)

    try:
        result = ask_question(
            question=payload.question,
            user_payload=user_payload,
            top_k=payload.top_k,
        )

        source_count = len(result.get("sources", []))

        send_audit_event(
            service_name="rag-service",
            action="RAG_QUERY_SUCCESS",
            status="success",
            user_id=user_payload.get("user_id"),
            user_email=user_payload.get("email"),
            ip_address=ip_address,
            request_id=request_id,
            details=(
                f"Question: {payload.question[:200]} | "
                f"Requested file: {requested_file or 'not specified'} | "
                f"Sources returned: {source_count}"
            ),
        )

        return result

    except Exception as exc:
        send_audit_event(
            service_name="rag-service",
            action="RAG_QUERY_FAILED",
            status="failed",
            user_id=user_payload.get("user_id"),
            user_email=user_payload.get("email"),
            ip_address=ip_address,
            request_id=request_id,
            details=str(exc),
        )

        raise