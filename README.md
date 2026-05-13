# 🔐 Secure RAG Document Assistant

> AI-powered secure distributed document processing & RAG platform built with **FastAPI, React, RabbitMQ, PostgreSQL, Docker, Ollama, and ChromaDB**.

---

# 🚀 System Architecture

```text
                ┌────────────────────┐
                │   React Frontend   │
                │   Vite + Tailwind  │
                └─────────┬──────────┘
                          │
                          ▼
                ┌────────────────────┐
                │   Nginx Gateway    │
                │ Rate Limiting +    │
                │ Secure Routing     │
                └─────────┬──────────┘
                          │
      ┌───────────────────┼───────────────────┐
      ▼                   ▼                   ▼
┌─────────────┐   ┌─────────────┐   ┌─────────────┐
│ Auth        │   │ Document    │   │ RAG         │
│ Service     │   │ Service     │   │ Service     │
└─────┬───────┘   └─────┬───────┘   └─────────────┘
      │                 │
      │                 ▼
      │         ┌─────────────┐
      │         │ RabbitMQ    │
      │         │ Queue       │
      │         └─────┬───────┘
      │               ▼
      │        ┌─────────────┐
      │        │ Worker      │
      │        │ Service     │
      │        └─────┬───────┘
      │              ▼
      │      ┌───────────────┐
      └────► │ PostgreSQL    │
             └───────────────┘

                    ▼
             ┌───────────────┐
             │ ChromaDB      │
             │ + Ollama      │
             └───────────────┘
```

---

# ✨ Features

## 🔐 Authentication & Security

* ✅ JWT Authentication
* ✅ Role-Based Access Control (RBAC)
* ✅ Admin/User separation
* ✅ Secure password hashing with bcrypt
* ✅ Protected API routes
* ✅ Admin-only endpoints
* ✅ Automatic admin seeding
* ✅ Nginx rate limiting
* ✅ Secure API gateway

---

## 📄 Secure Document Processing

* ✅ PDF-only upload validation
* ✅ File signature verification
* ✅ Dangerous extension blocking
* ✅ Filename sanitization
* ✅ SHA-256 hashing
* ✅ Fernet encryption
* ✅ Integrity verification
* ✅ Encrypted storage
* ✅ Ownership-based access control

---

## ⚡ Distributed Processing

* ✅ Microservices architecture
* ✅ RabbitMQ async messaging
* ✅ Worker-based background processing
* ✅ Distributed document pipeline
* ✅ Service isolation
* ✅ Dockerized infrastructure

---

## 🤖 AI & RAG Infrastructure

* ✅ Ollama integration
* ✅ ChromaDB vector database
* ✅ Async document processing pipeline
* 🚧 Embeddings pipeline
* 🚧 Semantic retrieval
* 🚧 AI chat with uploaded documents

---

# 🛠️ Tech Stack

## ⚙️ Backend

* FastAPI
* SQLAlchemy
* PostgreSQL
* RabbitMQ
* aio-pika
* bcrypt
* JWT
* Fernet Encryption

---

## 🎨 Frontend

* React
* Vite
* TailwindCSS
* React Router

---

## 🧠 AI / RAG

* Ollama
* ChromaDB

---

## 🐳 Infrastructure

* Docker
* Docker Compose
* Nginx
* Microservices Architecture

---

# 🧩 Services

| Service             | Purpose                     |
| ------------------- | --------------------------- |
| 🔑 auth-service     | Authentication, JWT, RBAC   |
| 📄 document-service | Secure upload & encryption  |
| ⚙️ worker-service   | Async background processing |
| 🧠 rag-service      | RAG & embeddings pipeline   |
| 📋 audit-service    | Audit logging               |
| 🌐 nginx-gateway    | API gateway & rate limiting |
| 🎨 frontend         | React frontend              |

---

# 🔄 Current Workflow

```text
📄 User uploads PDF
        │
        ▼
🛡️ Document Service validates file
        │
        ▼
🔐 SHA-256 hash generated
        │
        ▼
🔒 PDF encrypted using Fernet
        │
        ▼
🗄️ Metadata stored in PostgreSQL
        │
        ▼
📨 Job published to RabbitMQ
        │
        ▼
⚙️ Worker consumes job
        │
        ▼
✅ Integrity verification
        │
        ▼
🎉 Document marked as processed
```

---

# 🔒 Security Features

* 🔑 JWT verification
* 👤 Role-based authorization
* 🛡️ Secure file validation
* 📄 PDF signature checks
* 🔐 SHA-256 integrity checks
* 🔒 Fernet encryption
* 🗄️ Encrypted storage
* 🚦 API rate limiting
* 👥 Ownership validation
* 🌐 Secure gateway routing

---

# 📁 Project Structure

```text
secure-rag-document-assistant/
│
├── frontend/
├── gateway-nginx/
├── infrastructure/
│
├── backend/
│   ├── docker-compose.yml
│   ├── .env
│   │
│   └── services/
│       ├── auth-service/
│       ├── document-service/
│       ├── worker-service/
│       ├── rag-service/
│       └── audit-service/
```

---

# 🚀 Setup

## 📥 Clone Repository

```bash
git clone https://github.com/5iaal/secure-rag-document-assistant.git
cd secure-rag-document-assistant
```

---

# 🐳 Run with Docker

```bash
docker compose up --build
```

---

# 👑 Default Admin Account

```text
📧 Email: admin@secure-rag.com
🔑 Password: Admin12345
```

---

# 📡 API Examples

## 🔐 Register

```http
POST /api/auth/register
```

---

## 🔑 Login

```http
POST /api/auth/login
```

---

## 📄 Upload Document

```http
POST /api/documents/upload
```

---

## ✅ Verify Integrity

```http
GET /api/documents/{id}/verify
```

---

# 🚧 Planned Features

* 📄 PDF text extraction
* 👁️ OCR support
* 🧠 Embeddings generation
* 🔎 ChromaDB semantic search
* 🤖 Ollama LLM integration
* 💬 AI chat with documents
* ⚡ Streaming AI responses
* 📊 Audit dashboard
* 🤝 Document sharing
* ⚡ Redis caching
* ☸️ Kubernetes deployment
* 🔄 CI/CD pipeline

---

# 📌 Current Status

## ✅ Completed

* Authentication system
* RBAC
* JWT protection
* Secure document upload
* Encryption pipeline
* RabbitMQ integration
* Worker processing
* Distributed architecture
* Dockerized infrastructure

---

## 🚧 In Progress

* RAG pipeline
* Embeddings
* AI document chat
* ChromaDB indexing

---

# 🏆 Highlights

* 🔥 Fully Distributed Architecture
* 🔥 Secure-by-Design Backend
* 🔥 Async Processing Pipeline
* 🔥 Production-Style Microservices
* 🔥 AI + Cybersecurity Combination
* 🔥 Dockerized End-to-End System

---

# 📜 License

MIT License
