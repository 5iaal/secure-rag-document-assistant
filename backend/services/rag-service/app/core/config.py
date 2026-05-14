from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    jwt_secret: str
    internal_api_key: str

    jwt_algorithm: str = "HS256"

    chroma_host: str = "chromadb"
    chroma_port: int = 8000
    chroma_collection_name: str = "documents"

    ollama_url: str = "http://ollama:11434"
    ollama_chat_model: str = "llama3.2:1b"
    ollama_embed_model: str = "nomic-embed-text"

    class Config:
        env_file = ".env"


settings = Settings()