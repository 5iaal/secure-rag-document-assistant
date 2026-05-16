import re

import chromadb
import httpx

from app.core.config import settings


MIN_RELEVANCE_SCORE = 0.05


def get_collection():
    client = chromadb.HttpClient(
        host=settings.chroma_host,
        port=settings.chroma_port,
    )

    return client.get_or_create_collection(
        name=settings.chroma_collection_name,
        metadata={"hnsw:space": "cosine"},
    )


def extract_requested_filename(question: str) -> str | None:
    normalized = question.replace("ال", " ")

    matches = re.findall(
        r"([A-Za-z0-9_\-\u0600-\u06FF]+\.pdf)",
        normalized,
        flags=re.IGNORECASE,
    )

    if not matches:
        return None

    return matches[-1].strip().lower()


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


def retrieve_chunks(
    question: str,
    user_payload: dict,
    top_k: int = 5,
) -> list[dict]:
    collection = get_collection()
    question_embedding = generate_embedding(question)

    requested_filename = extract_requested_filename(question)

    filters = []

    if user_payload["role"] != "admin":
        filters.append({"owner_id": user_payload["user_id"]})

    if requested_filename:
        filters.append({"filename_lower": requested_filename})

    where_filter = None

    if len(filters) == 1:
        where_filter = filters[0]
    elif len(filters) > 1:
        where_filter = {"$and": filters}

    results = collection.query(
        query_embeddings=[question_embedding],
        n_results=top_k,
        where=where_filter,
        include=["documents", "metadatas", "distances"],
    )

    documents = results.get("documents", [[]])[0]
    metadatas = results.get("metadatas", [[]])[0]
    distances = results.get("distances", [[]])[0]

    chunks = []

    for text, metadata, distance in zip(documents, metadatas, distances):
        relevance_score = max(0.0, 1.0 - float(distance))

        if relevance_score < MIN_RELEVANCE_SCORE:
            continue

        chunks.append(
            {
                "text": text,
                "metadata": metadata or {},
                "relevance_score": round(relevance_score, 4),
            }
        )

    return chunks


def build_context(chunks: list[dict]) -> str:
    context_blocks = []

    for index, chunk in enumerate(chunks, start=1):
        metadata = chunk["metadata"]

        filename = metadata.get("filename", "Unknown document")
        document_id = metadata.get("document_id", "N/A")
        chunk_index = metadata.get("chunk_index", "N/A")
        score = chunk.get("relevance_score", 0)

        context_blocks.append(
            f"""
[Source {index}]
Filename: {filename}
Document ID: {document_id}
Chunk Index: {chunk_index}
Relevance Score: {score}

Content:
{chunk["text"]}
""".strip()
        )

    return "\n\n---\n\n".join(context_blocks)


def generate_answer(question: str, chunks: list[dict]) -> str:
    context = build_context(chunks)

    prompt = f"""
You are a secure enterprise RAG document assistant.

Rules:
- Answer ONLY using the provided document context.
- If relevant context exists, answer directly.
- Do NOT say the document was not provided if sources exist.
- Do NOT use outside knowledge.
- Do NOT invent facts.
- If the user asks about a page, explain the closest relevant part from the provided context.
- If the exact page is not explicitly available, say: "The exact page number is not stored, but the relevant content says..."
- If the user asks in Arabic, answer in Arabic.
- If the user asks in English, answer in English.

Document Context:
{context}

User Question:
{question}

Answer:
""".strip()

    response = httpx.post(
        f"{settings.ollama_url}/api/generate",
        json={
            "model": settings.ollama_chat_model,
            "prompt": prompt,
            "stream": False,
            "options": {
                "temperature": 0.15,
                "top_p": 0.8,
                "num_predict": 700,
            },
        },
        timeout=240,
    )

    response.raise_for_status()

    answer = response.json().get("response", "").strip()

    bad_prefixes = [
        "I am unable to provide a summary or details of the document",
        "I am unable to provide a detailed answer to your question",
        "I cannot provide a summary because the document is not provided",
        "The document is not provided",
        "I cannot provide information on this topic",
    ]

    for prefix in bad_prefixes:
        if answer.startswith(prefix) and "\n\n" in answer:
            answer = answer.split("\n\n", 1)[1].strip()

    return answer


def ask_question(
    question: str,
    user_payload: dict,
    top_k: int = 5,
) -> dict:
    chunks = retrieve_chunks(
        question=question,
        user_payload=user_payload,
        top_k=top_k,
    )

    if not chunks:
        return {
            "answer": "I could not find enough information in the uploaded documents.",
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
                "relevance_score": chunk.get("relevance_score"),
                "text": chunk["text"],
            }
        )

    return {
        "answer": answer,
        "sources": sources,
    }