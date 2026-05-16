import httpx
import chromadb

from app.core.config import settings


OLLAMA_EMBED_MODEL = "nomic-embed-text"


def get_collection():
    client = chromadb.HttpClient(
        host=settings.chroma_host,
        port=settings.chroma_port,
    )

    return client.get_or_create_collection(
        name=settings.chroma_collection_name,
        metadata={"hnsw:space": "cosine"},
    )


def generate_embedding(text: str) -> list[float]:
    response = httpx.post(
        "http://ollama:11434/api/embeddings",
        json={
            "model": OLLAMA_EMBED_MODEL,
            "prompt": text,
        },
        timeout=120,
    )

    response.raise_for_status()

    data = response.json()

    return data["embedding"]


def index_document_chunks(
    document_id: int,
    owner_id: int,
    filename: str,
    chunks: list[str],
) -> int:
    if not chunks:
        return 0

    collection = get_collection()

    ids = []
    embeddings = []
    metadatas = []

    filename_lower = filename.lower().strip()

    for index, chunk in enumerate(chunks):
        embedding = generate_embedding(chunk)

        ids.append(f"doc_{document_id}_chunk_{index}")

        embeddings.append(embedding)

        metadatas.append(
            {
                "document_id": document_id,
                "owner_id": owner_id,
                "filename": filename,
                "filename_lower": filename_lower,
                "chunk_index": index,
            }
        )

    collection.upsert(
        ids=ids,
        documents=chunks,
        embeddings=embeddings,
        metadatas=metadatas,
    )

    return len(chunks)