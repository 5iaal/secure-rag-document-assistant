from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    postgres_db: str
    postgres_user: str
    postgres_password: str

    rabbitmq_user: str
    rabbitmq_password: str

    fernet_key: str

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