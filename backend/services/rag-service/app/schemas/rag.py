from pydantic import BaseModel, Field


class AskRequest(BaseModel):
    question: str = Field(min_length=3, max_length=1000)
    top_k: int = 4


class SourceChunk(BaseModel):
    document_id: int | None = None
    filename: str | None = None
    chunk_index: int | None = None
    text: str


class AskResponse(BaseModel):
    answer: str
    sources: list[SourceChunk]