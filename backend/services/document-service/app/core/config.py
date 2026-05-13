from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    postgres_db: str
    postgres_user: str
    postgres_password: str
    jwt_secret: str
    internal_api_key: str

    rabbitmq_user: str
    rabbitmq_password: str

    fernet_key: str
    max_file_size_mb: int = 10

    jwt_algorithm: str = "HS256"

    @property
    def database_url(self) -> str:
        return (
            f"postgresql://{self.postgres_user}:"
            f"{self.postgres_password}@postgres:5432/{self.postgres_db}"
        )

    @property
    def rabbitmq_url(self) -> str:
        return (
            f"amqp://{self.rabbitmq_user}:"
            f"{self.rabbitmq_password}@rabbitmq:5672/"
        )

    class Config:
        env_file = ".env"


settings = Settings()