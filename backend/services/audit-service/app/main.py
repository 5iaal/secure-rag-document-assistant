from fastapi import FastAPI

from app.database.session import Base, engine
from app.routes.audit_routes import router as audit_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Audit Service",
    description="Centralized audit logging service",
    version="1.0.0",
)

app.include_router(audit_router)


@app.get("/health")
def health_check():
    return {"service": "audit-service", "status": "healthy"}