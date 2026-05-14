from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    postgres_db: str
    postgres_user: str
    postgres_password: str
    jwt_secret: str
    internal_api_key: str

    jwt_algorithm: str = "HS256"

    @property
    def database_url(self) -> str:
        return (
            f"postgresql://{self.postgres_user}:"
            f"{self.postgres_password}@postgres:5432/{self.postgres_db}"
        )

    class Config:
        env_file = ".env"


settings = Settings()