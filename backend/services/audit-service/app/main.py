from fastapi import FastAPI

app = FastAPI(title="Audit Service")

@app.get("/health")
def health_check():
    return {"service": "audit-service", "status": "healthy"}

@app.get("/audit/health")
def audit_health():
    return {"service": "audit-service", "status": "healthy"}