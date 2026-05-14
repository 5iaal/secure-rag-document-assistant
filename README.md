# 🛡️ Secure Distributed RAG Document Assistant

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
* ✅ Frontend route protection
* ✅ Persistent login sessions

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
* ✅ Background document processing
* ✅ Distributed processing queue

---

## ⚡ Distributed Processing

* ✅ Microservices architecture
* ✅ RabbitMQ async messaging
* ✅ Worker-based background processing
* ✅ Distributed document pipeline
* ✅ Service isolation
* ✅ Dockerized infrastructure
* ✅ API Gateway routing
* ✅ Async processing architecture

---

## 🤖 AI & RAG Infrastructure

* ✅ Ollama integration
* ✅ ChromaDB vector database
* ✅ `nomic-embed-text` embeddings
* ✅ Async document processing pipeline
* ✅ Semantic retrieval
* ✅ AI chat with uploaded documents
* ✅ Source chunk references
* ✅ Context-aware AI responses

---

## 🧾 Audit & Monitoring

* ✅ Distributed audit logging
* ✅ Login success/failure tracking
* ✅ User activity monitoring
* ✅ Service-level audit events
* ✅ Security monitoring dashboard
* ✅ Failed login analytics
* ✅ Admin monitoring panel

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
🧠 Text extraction + chunking
        │
        ▼
📦 Embeddings stored in ChromaDB
        │
        ▼
🤖 RAG Service retrieves context
        │
        ▼
💬 AI generates contextual answer
```

---

# 🛠️ Tech Stack

## ⚙️ Backend

* FastAPI
* SQLAlchemy
* PostgreSQL
* RabbitMQ
* aio-pika
* JWT
* bcrypt
* Fernet Encryption
* ChromaDB
* Ollama

---

## 🎨 Frontend

* React
* Vite
* TailwindCSS
* React Router
* Lucide Icons

---

## 🧠 AI / RAG

* Ollama
* ChromaDB
* nomic-embed-text
* Semantic Retrieval
* Vector Embeddings

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
* 🧾 Audit trail logging
* ⚡ Queue isolation

---

# 🎨 Frontend Features

## 👤 User Features

* Secure Login/Register
* Upload encrypted documents
* Verify document integrity
* AI document chat
* Document dashboard
* Secure settings page
* Session persistence

---

## 🛡️ Admin Features

* Admin dashboard
* Audit log viewer
* Failed login tracking
* Security monitoring
* Service analytics
* System activity overview

---

# 📁 Project Structure

```text
secure-rag-document-assistant/
│
├── frontend/
│   ├── src/
│   ├── pages/
│   ├── components/
│   └── api/
│
├── backend/
│   ├── docker-compose.yml
│   ├── nginx/
│   │
│   └── services/
│       ├── auth-service/
│       ├── document-service/
│       ├── worker-service/
│       ├── rag-service/
│       └── audit-service/
│
└── README.md
```

---

# ⚙️ Setup & Installation

## 📥 Clone Repository

```bash
git clone https://github.com/5iaal/secure-rag-document-assistant.git
cd secure-rag-document-assistant
```

---

## 🐳 Run Docker Infrastructure

```bash
cd backend
docker compose up -d --build
```

---

## 📦 Verify Running Containers

```bash
docker compose ps
```

---

## 🧠 Pull Embedding Model

```bash
docker exec -it ollama ollama pull nomic-embed-text
```

---

## 🎨 Start Frontend

```bash
cd frontend
npm install
npm run dev
```

---

# 👑 Default Admin Account

```text
📧 Email: admin@secure-rag.com
🔑 Password: Admin12345
```

---

# 📡 API Examples

## 🔐 Login

```powershell
Invoke-RestMethod -Uri "http://localhost/api/auth/login" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"email":"admin@secure-rag.com","password":"Admin12345"}'
```

---

## 📄 Upload Document

```powershell
curl.exe -X POST "http://localhost/api/documents/upload" `
  -H "Authorization: Bearer TOKEN" `
  -F "file=@test.pdf;type=application/pdf"
```

---

## 🤖 Ask AI

```powershell
Invoke-RestMethod -Uri "http://localhost/api/rag/ask" `
  -Method POST `
  -Headers @{Authorization="Bearer TOKEN"} `
  -ContentType "application/json" `
  -Body '{"question":"What is this document about?","top_k":4}'
```

---

# 📈 Current Project Status

## ✅ Completed

* Distributed microservices architecture
* JWT authentication system
* RBAC authorization
* React frontend integration
* Secure PDF upload
* Background document processing
* ChromaDB vector indexing
* Ollama embeddings integration
* AI RAG querying
* Audit logging service
* Admin dashboard
* Document integrity verification
* Protected frontend routes
* Dockerized deployment

---

## 🚧 Planned Improvements

* HTTPS certificates
* File download endpoint
* OCR support
* Real-time notifications
* Multi-file contextual chat
* Streaming AI responses
* Redis caching
* Kubernetes deployment
* CI/CD pipeline
* Refresh token authentication

---

# 📸 Screenshots

## 🔐 Login Page

<img width="100%" alt="Login" src="screenshots/login.png" />

---

## 📊 Dashboard

<img width="100%" alt="Dashboard" src="screenshots/dashboard.png" />

---

## 🤖 AI Chat

<img width="100%" alt="AI Chat" src="screenshots/ai-chat.png" />

---

# 🏆 Highlights

* 🔥 Fully Distributed Architecture
* 🔥 Secure-by-Design Backend
* 🔥 Async Processing Pipeline
* 🔥 Production-Style Microservices
* 🔥 AI + Cybersecurity Combination
* 🔥 Dockerized End-to-End System
* 🔥 Local AI Processing
* 🔥 Enterprise-style Security Monitoring

---

# 👨‍💻 Author

## Ahmad Elkhial

* Cybersecurity & AI Developer
* Distributed Systems Enthusiast
* Backend & AI Engineer

GitHub:

[https://github.com/5iaal](https://github.com/5iaal)

---

# 📜 License

MIT License
