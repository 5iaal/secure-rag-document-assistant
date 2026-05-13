from fastapi import FastAPI

app = FastAPI(title="RAG Service")

@app.get("/health")
def health_check():
    return {"service": "rag-service", "status": "healthy"}

@app.get("/rag/health")
def rag_health():
    return {"service": "rag-service", "status": "healthy"}