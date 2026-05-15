from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    postgres_db: str
    postgres_user: str
    postgres_password: str

    jwt_secret: str
    internal_api_key: str

    admin_full_name: str = "System Admin"
    admin_email: str = "admin@secure-rag.com"
    admin_password: str = "Admin12345"

    audit_service_url: str = "http://audit-service:8000/audit/events"

    github_client_id: str = ""
    github_client_secret: str = ""

    google_client_id: str = ""
    google_client_secret: str = ""

    frontend_url: str = "http://localhost:3000"
    oauth_session_secret: str = "super_oauth_session_secret_change_me"

    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60

    @property
    def database_url(self) -> str:
        return (
            f"postgresql://{self.postgres_user}:"
            f"{self.postgres_password}@postgres:5432/{self.postgres_db}"
        )

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()