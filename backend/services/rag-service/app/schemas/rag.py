from pydantic import BaseModel, Field


class AskRequest(BaseModel):
    question: str = Field(min_length=3, max_length=1000)
    top_k: int = Field(default=5, ge=1, le=10)


class SourceChunk(BaseModel):
    document_id: int | None = None
    filename: str | None = None
    chunk_index: int | None = None
    relevance_score: float | None = None
    text: str


class AskResponse(BaseModel):
    answer: str
    sources: list[SourceChunk]