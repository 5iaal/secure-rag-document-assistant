from fastapi import FastAPI

from app.routes.rag_routes import router as rag_router

app = FastAPI(
    title="RAG Service",
    description="Retrieval-Augmented Generation service using ChromaDB and Ollama",
    version="1.0.0",
)

app.include_router(rag_router)


@app.get("/health")
def health_check():
    return {"service": "rag-service", "status": "healthy"}