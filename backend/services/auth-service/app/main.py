from fastapi import FastAPI

from app.database.session import Base, engine, SessionLocal
from app.database.seed_admin import seed_admin_user
from app.routes.auth_routes import router as auth_router

Base.metadata.create_all(bind=engine)

db = SessionLocal()
try:
    seed_admin_user(db)
finally:
    db.close()

app = FastAPI(
    title="Auth Service",
    description="Authentication, JWT, bcrypt, and RBAC service",
    version="1.0.0",
)

app.include_router(auth_router)


@app.get("/health")
def health_check():
    return {"service": "auth-service", "status": "healthy"}