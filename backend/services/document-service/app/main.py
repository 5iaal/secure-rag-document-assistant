from fastapi import FastAPI

from app.database.session import Base, engine
from app.routes.document_routes import router as document_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Document Service",
    description="Secure upload, encryption, hashing, and metadata service",
    version="1.0.0",
)

app.include_router(document_router)


@app.get("/health")
def health_check():
    return {"service": "document-service", "status": "healthy"}