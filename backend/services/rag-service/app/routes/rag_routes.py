from fastapi import APIRouter, Depends

from app.schemas.rag import AskRequest, AskResponse
from app.services.rag_service import ask_question
from app.utils.dependencies import get_current_user_payload

router = APIRouter(prefix="/rag", tags=["RAG"])


@router.get("/health")
def health_check():
    return {"service": "rag-service", "status": "healthy"}


@router.post("/ask", response_model=AskResponse)
def ask(
    payload: AskRequest,
    user_payload: dict = Depends(get_current_user_payload),
):
    return ask_question(
        question=payload.question,
        user_payload=user_payload,
        top_k=payload.top_k,
    )