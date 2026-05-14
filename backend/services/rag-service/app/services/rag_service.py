import httpx
import chromadb

from app.core.config import settings


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
        f"{settings.ollama_url}/api/embeddings",
        json={
            "model": settings.ollama_embed_model,
            "prompt": text,
        },
        timeout=120,
    )

    response.raise_for_status()
    return response.json()["embedding"]


def retrieve_chunks(question: str, user_payload: dict, top_k: int = 4) -> list[dict]:
    collection = get_collection()
    question_embedding = generate_embedding(question)

    where_filter = None

    if user_payload["role"] != "admin":
        where_filter = {"owner_id": user_payload["user_id"]}

    results = collection.query(
        query_embeddings=[question_embedding],
        n_results=top_k,
        where=where_filter,
    )

    chunks = []

    documents = results.get("documents", [[]])[0]
    metadatas = results.get("metadatas", [[]])[0]

    for text, metadata in zip(documents, metadatas):
        chunks.append(
            {
                "text": text,
                "metadata": metadata or {},
            }
        )

    return chunks


def generate_answer(question: str, chunks: list[dict]) -> str:
    context = "\n\n".join(
        [f"[Source {i + 1}]\n{chunk['text']}" for i, chunk in enumerate(chunks)]
    )

    prompt = f"""
You are a secure document assistant.
Answer the user's question using ONLY the provided context.
If the context does not contain the answer, say: "I could not find enough information in the uploaded documents."

Context:
{context}

Question:
{question}

Answer:
"""

    response = httpx.post(
        f"{settings.ollama_url}/api/generate",
        json={
            "model": settings.ollama_chat_model,
            "prompt": prompt,
            "stream": False,
        },
        timeout=180,
    )

    response.raise_for_status()
    return response.json().get("response", "").strip()


def ask_question(question: str, user_payload: dict, top_k: int = 4) -> dict:
    chunks = retrieve_chunks(question, user_payload, top_k)

    if not chunks:
        return {
            "answer": "I could not find any indexed document chunks for this question.",
            "sources": [],
        }

    answer = generate_answer(question, chunks)

    sources = []

    for chunk in chunks:
        metadata = chunk["metadata"]

        sources.append(
            {
                "document_id": metadata.get("document_id"),
                "filename": metadata.get("filename"),
                "chunk_index": metadata.get("chunk_index"),
                "text": chunk["text"],
            }
        )

    return {
        "answer": answer,
        "sources": sources,
    }