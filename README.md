# 🛡️ Secure Distributed RAG Document Assistant

> AI-powered secure distributed document processing and RAG platform built with **FastAPI, React, RabbitMQ, PostgreSQL, Docker, Nginx, Ollama, and ChromaDB**.

This project is not just a chatbot. It is a secure distributed system that combines **Authentication, OAuth, RBAC, Encrypted Document Storage, RabbitMQ Async Processing, RAG, Audit Logging, Request Tracing, HTTPS, and Admin Monitoring**.

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
                │ HTTPS + Routing    │
                │ Request Tracing    │
                └─────────┬──────────┘
                          │
      ┌───────────────────┼───────────────────┐
      ▼                   ▼                   ▼
┌─────────────┐   ┌─────────────┐   ┌─────────────┐
│ Auth        │   │ Document    │   │ RAG         │
│ Service     │   │ Service     │   │ Service     │
└─────┬───────┘   └─────┬───────┘   └─────┬───────┘
      │                 │                 │
      │                 ▼                 ▼
      │         ┌─────────────┐   ┌─────────────┐
      │         │ RabbitMQ    │   │ ChromaDB    │
      │         │ Queue       │   │ Vector DB   │
      │         └─────┬───────┘   └─────┬───────┘
      │               ▼                 ▼
      │        ┌─────────────┐   ┌─────────────┐
      │        │ Worker      │   │ Ollama      │
      │        │ Service     │   │ Local AI    │
      │        └─────┬───────┘   └─────────────┘
      │              ▼
      │      ┌───────────────┐
      └────► │ PostgreSQL    │
             └───────────────┘

                    ▼
             ┌───────────────┐
             │ Audit Service │
             │ Logs + Trace  │
             └───────────────┘
```

---

# ✨ Features

## 🔐 Authentication & Security

* ✅ JWT Authentication
* ✅ Email/password login
* ✅ User registration
* ✅ Google OAuth login
* ✅ GitHub OAuth login
* ✅ Role-Based Access Control
* ✅ Admin/User separation
* ✅ Secure password hashing with bcrypt
* ✅ Protected API routes
* ✅ Protected frontend routes
* ✅ Admin-only endpoints
* ✅ Automatic admin seeding
* ✅ Secure session handling using `sessionStorage`
* ✅ Logout clears session immediately
* ✅ Invalid token auditing
* ✅ Forbidden admin access auditing
* ✅ Nginx rate limiting
* ✅ API Gateway security headers
* ✅ HTTPS support using self-signed local certificate
* ✅ HTTP → HTTPS redirect

---

## 📄 Secure Document Management

* ✅ PDF-only upload validation
* ✅ MIME type validation
* ✅ PDF signature verification
* ✅ Dangerous extension blocking
* ✅ Filename sanitization
* ✅ SHA-256 hashing
* ✅ Fernet encryption
* ✅ Encrypted file storage
* ✅ Integrity verification
* ✅ Ownership-based access control
* ✅ Document download with decryption
* ✅ Document delete flow
* ✅ Document metadata stored in PostgreSQL
* ✅ Async document processing using RabbitMQ
* ✅ Upload success audit logging
* ✅ Upload failure audit logging
* ✅ Download audit logging
* ✅ Delete audit logging

---

## ⚡ Distributed Processing

* ✅ Microservices architecture
* ✅ Dockerized services
* ✅ RabbitMQ async messaging
* ✅ Worker-based background processing
* ✅ Distributed document pipeline
* ✅ Service isolation
* ✅ API Gateway routing
* ✅ Queue-based processing
* ✅ PostgreSQL persistence
* ✅ Worker indexing lifecycle audit logs
* ✅ Worker indexing started logs
* ✅ Worker indexing completed logs
* ✅ Worker indexing failed logs

---

## 🤖 AI & RAG Infrastructure

* ✅ Ollama integration
* ✅ ChromaDB vector database
* ✅ `nomic-embed-text` embeddings
* ✅ PDF text extraction
* ✅ Text chunking
* ✅ Vector indexing
* ✅ Semantic retrieval
* ✅ AI chat with uploaded documents
* ✅ Context-aware AI responses
* ✅ Persistent chat history
* ✅ Recent chats sidebar
* ✅ Per-chat document context memory
* ✅ Follow-up questions remember the selected document
* ✅ Multi-chat conversation handling
* ✅ RAG query success/failure audit logging

---

## 🧾 Audit, Monitoring & Traceability

* ✅ Centralized audit logging
* ✅ Login success/failure tracking
* ✅ OAuth login audit events
* ✅ Document upload audit events
* ✅ Document upload failure audit events
* ✅ Document integrity audit events
* ✅ Document download audit events
* ✅ Document delete audit events
* ✅ RAG query success/failure audit events
* ✅ Worker indexing started audit events
* ✅ Worker indexing completed audit events
* ✅ Worker indexing failed audit events
* ✅ Unauthorized token audit events
* ✅ Forbidden admin access audit events
* ✅ Distributed `X-Request-ID` tracing
* ✅ Request ID propagated from Nginx to services
* ✅ Request ID stored in audit logs
* ✅ Request ID displayed in frontend Audit Logs
* ✅ Admin audit log viewer
* ✅ Admin monitoring dashboard
* ✅ Registered users list for admin
* ✅ Backend-driven admin stats endpoint

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
🧠 Text extraction + chunking
        │
        ▼
📦 Embeddings stored in ChromaDB
        │
        ▼
🤖 RAG Service retrieves context
        │
        ▼
💬 Ollama generates contextual answer
        │
        ▼
🧾 Audit logs store action + request_id
```

---

# 🧠 AI Chat Memory Flow

```text
User starts a new chat
        │
        ▼
User asks about a document, e.g. Sensor.pdf
        │
        ▼
Frontend stores active document context for that chat
        │
        ▼
User asks follow-up question without repeating filename
        │
        ▼
Frontend automatically sends context-aware question
        │
        ▼
RAG Service retrieves chunks from the selected document
        │
        ▼
AI answers using the correct document context
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
* httpx
* pypdf

---

## 🎨 Frontend

* React
* Vite
* TailwindCSS
* React Router
* Lucide Icons
* Session Storage Auth
* Local Storage Chat History

---

## 🧠 AI / RAG

* Ollama
* ChromaDB
* `nomic-embed-text`
* Semantic Retrieval
* Vector Embeddings
* Local LLM Generation

---

## 🐳 Infrastructure

* Docker
* Docker Compose
* Nginx
* HTTPS
* Microservices Architecture

---

# 🧩 Services

| Service             | Purpose                                      |
| ------------------- | -------------------------------------------- |
| 🔑 auth-service     | Authentication, JWT, OAuth, RBAC, admin APIs |
| 📄 document-service | Secure upload, encryption, download, delete  |
| ⚙️ worker-service   | Async PDF processing and vector indexing     |
| 🧠 rag-service      | RAG retrieval and AI answer generation       |
| 📋 audit-service    | Centralized audit logs and request tracing   |
| 🌐 nginx-gateway    | API gateway, HTTPS, redirect, rate limiting  |
| 🐘 postgres         | Relational database                          |
| 🐇 rabbitmq         | Message queue                                |
| 🧠 chromadb         | Vector database                              |
| 🤖 ollama           | Local AI embeddings and generation           |
| 🎨 frontend         | React frontend                               |

---

# 🔒 Security Features

* 🔑 JWT verification
* 👤 Role-based authorization
* 🌐 Google OAuth
* 🐙 GitHub OAuth
* 🛡️ Secure file validation
* 📄 PDF signature checks
* 🔐 SHA-256 integrity checks
* 🔒 Fernet encryption
* 🗄️ Encrypted storage
* 🚦 API rate limiting
* 👥 Ownership validation
* 🌐 Secure gateway routing
* 🧾 Audit trail logging
* 🔍 Distributed request tracing
* ⚡ Queue isolation
* 🧯 Security headers
* 🔐 HTTPS support
* 🔁 HTTP → HTTPS redirect
* 🔑 Internal API key between services
* 🚫 Invalid token logging
* 🚫 Unauthorized access logging

---

# 🎨 Frontend Features

## 👤 User Features

* Secure Login/Register
* Google OAuth login
* GitHub OAuth login
* Upload encrypted documents
* List user documents
* Verify document integrity
* Download decrypted PDF
* Delete documents
* AI chat with indexed documents
* User dashboard
* Settings page
* Session ends when browser/session closes
* Persistent AI chat history
* Recent chats sidebar
* Per-chat active document memory
* Follow-up questions continue using the same file context

---

## 🛡️ Admin Features

* Admin dashboard
* Audit log viewer
* Failed login tracking
* Failed upload tracking
* Security monitoring
* Service analytics
* System activity overview
* Request ID visibility in logs
* Registered users list
* Backend-driven stats
* Worker indexing monitoring
* RAG query monitoring
* Unauthorized access monitoring

---

# 📁 Project Structure

```text
secure-rag-document-assistant/
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── pages/
│   │   └── components/
│   └── vite.config.js
│
├── backend/
│   ├── docker-compose.yml
│   ├── .env.example
│   ├── gateway-nginx/
│   │   ├── nginx.conf
│   │   └── certs/
│   │
│   └── services/
│       ├── auth-service/
│       ├── document-service/
│       ├── worker-service/
│       ├── rag-service/
│       └── audit-service/
│
├── screenshots/
├── .gitignore
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

## 🔐 Create Environment File

Copy the example file:

```bash
cd backend
cp .env.example .env
```

On Windows PowerShell:

```powershell
cd backend
copy .env.example .env
```

Then edit:

```text
backend/.env
```

You must configure:

```env
POSTGRES_DB=secure_rag_db
POSTGRES_USER=secure_user
POSTGRES_PASSWORD=your_password

JWT_SECRET=your_jwt_secret
FERNET_KEY=your_generated_fernet_key
INTERNAL_API_KEY=your_internal_api_key

RABBITMQ_DEFAULT_USER=secure_rabbit_user
RABBITMQ_DEFAULT_PASS=your_rabbit_password

FRONTEND_URL=https://localhost

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

Generate a Fernet key:

```bash
python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"
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

Expected services:

```text
auth-service
document-service
rag-service
audit-service
worker-service
frontend
nginx-gateway
postgres
rabbitmq
chromadb
ollama
```

---

## 🧠 Pull Ollama Embedding Model

```bash
docker exec -it ollama ollama pull nomic-embed-text
```

If your chat model is not pulled yet, pull it too:

```bash
docker exec -it ollama ollama pull llama3.2
```

---

## 🌐 Open the Application

The system runs through Nginx over HTTPS:

```text
https://localhost
```

Because the certificate is self-signed, the browser may show a warning.

Choose:

```text
Advanced → Proceed to localhost
```

---

# 👑 Default Admin Account

```text
Email: admin@secure-rag.com
Password: Admin12345
```

---

# 🔐 OAuth Setup

## Google OAuth

In Google Cloud Console:

### Authorized JavaScript origins

```text
https://localhost
```

### Authorized redirect URIs

```text
https://localhost/api/auth/google/callback
```

---

## GitHub OAuth

In GitHub Developer Settings:

### Homepage URL

```text
https://localhost
```

### Authorization callback URL

```text
https://localhost/api/auth/github/callback
```

---

## Backend `.env`

```env
FRONTEND_URL=https://localhost

GOOGLE_REDIRECT_URI=https://localhost/api/auth/google/callback
GITHUB_REDIRECT_URI=https://localhost/api/auth/github/callback
```

After changing OAuth settings:

```bash
cd backend
docker compose build --no-cache auth-service frontend
docker compose up -d auth-service frontend nginx-gateway
```

---

# 🚀 How I Run It Locally

From project root:

```powershell
cd C:\Users\MSI\secure-rag-document-assistant\backend
docker compose up -d --build
```

Then:

```powershell
docker compose ps
```

Open:

```text
https://localhost
```

If frontend or backend changes were made:

```powershell
docker compose build --no-cache auth-service document-service rag-service worker-service frontend
docker compose up -d auth-service document-service rag-service worker-service frontend nginx-gateway
```

For only frontend rebuild:

```powershell
docker compose build --no-cache frontend
docker compose up -d frontend
docker compose restart nginx-gateway
```

For only auth-service rebuild:

```powershell
docker compose build --no-cache auth-service
docker compose up -d auth-service nginx-gateway
```

---

# 📡 API Examples

## 🔐 Login

```powershell
curl.exe -k -X POST "https://localhost/api/auth/login" `
  -H "Content-Type: application/json" `
  -d "{\"email\":\"admin@secure-rag.com\",\"password\":\"Admin12345\"}"
```

---

## 📄 Upload Document

```powershell
curl.exe -k -X POST "https://localhost/api/documents/upload" `
  -H "Authorization: Bearer TOKEN" `
  -F "file=@test.pdf;type=application/pdf"
```

---

## ✅ Verify Integrity

```powershell
curl.exe -k "https://localhost/api/documents/1/verify" `
  -H "Authorization: Bearer TOKEN"
```

---

## 📥 Download Document

```powershell
curl.exe -k -L "https://localhost/api/documents/1/download" `
  -H "Authorization: Bearer TOKEN" `
  -o "downloaded-file.pdf"
```

---

## 🗑️ Delete Document

```powershell
curl.exe -k -X DELETE "https://localhost/api/documents/1" `
  -H "Authorization: Bearer TOKEN"
```

---

## 🤖 Ask AI

```powershell
curl.exe -k -X POST "https://localhost/api/rag/ask" `
  -H "Authorization: Bearer TOKEN" `
  -H "Content-Type: application/json" `
  -d "{\"question\":\"What is this document about?\",\"top_k\":5}"
```

---

## 🧾 Get Audit Logs

```powershell
curl.exe -k "https://localhost/api/audit/events"
```

---

## 🔍 Test Request ID Tracing

```powershell
curl.exe -k -X POST "https://localhost/api/auth/login" `
  -H "Content-Type: application/json" `
  -H "X-Request-ID: test-auth-request-123" `
  -d "{\"email\":\"admin@secure-rag.com\",\"password\":\"Admin12345\"}"
```

Then check Audit Logs and confirm that the same `request_id` is stored.

---

# 🧪 Security Test Examples

## Invalid Token Test

```powershell
curl.exe -k "https://localhost/api/documents/me" `
  -H "Authorization: Bearer fake-invalid-token"
```

Expected result:

```text
Invalid or expired token
```

Audit Logs should show:

```text
AUTH_UNAUTHORIZED
```

---

## Failed Upload Test

```powershell
echo "bad file test" > bad.txt

curl.exe -k -X POST "https://localhost/api/documents/upload" `
  -H "Authorization: Bearer TOKEN" `
  -F "file=@bad.txt;type=text/plain"
```

Audit Logs should show:

```text
DOCUMENT_UPLOAD_FAILED
```

---

## HTTP to HTTPS Redirect Test

```powershell
curl.exe -I http://localhost/api/auth/health
```

Expected:

```text
HTTP/1.1 301 Moved Permanently
Location: https://localhost/api/auth/health
```

HTTPS test:

```powershell
curl.exe -k https://localhost/api/auth/health
```

Expected:

```json
{"service":"auth-service","status":"healthy"}
```

---

# 📈 Current Project Status

## ✅ Completed

* Distributed microservices architecture
* JWT authentication system
* Google OAuth
* GitHub OAuth
* RBAC authorization
* Secure session management
* React frontend integration
* Secure PDF upload
* Document download
* Document delete
* Background document processing
* PDF extraction and chunking
* ChromaDB vector indexing
* Ollama embeddings integration
* AI RAG querying
* Audit logging service
* Request ID tracing
* Admin dashboard
* Admin users list
* Backend-driven admin stats
* Document integrity verification
* Protected frontend routes
* HTTPS support
* HTTP → HTTPS redirect
* Rate limiting
* Dockerized deployment
* Failed upload audit logging
* RAG query audit logging
* Worker indexing audit logging
* Unauthorized access audit logging
* Persistent AI chat memory
* Recent chats system
* Request ID displayed in Audit Logs UI

---

## 🚧 Planned Improvements

* Page-aware RAG indexing
* Store chat history in backend database instead of browser local storage
* OCR support
* Streaming AI responses
* Toast notifications
* Better upload progress
* Dead-letter queue / retry policies
* Redis caching
* MITM/Wireshark documentation
* Kubernetes deployment
* CI/CD pipeline

---

# 📸 Screenshots

## 🔐 Login Page

<img width="100%" alt="Login" src="screenshots/login.png" />

---

## 📊 Dashboard

<img width="100%" alt="Dashboard" src="screenshots/dashboard.png" />

---

## 📄 Documents

<img width="100%" alt="Documents" src="screenshots/documents.png" />

---

## 🤖 AI Chat

<img width="100%" alt="AI Chat" src="screenshots/ai-chat.png" />

---

## 🧾 Audit Logs

<img width="100%" alt="Audit Logs" src="screenshots/audit-logs.png" />

---

# 🏆 Highlights

* 🔥 Fully Distributed Architecture
* 🔥 Secure-by-Design Backend
* 🔥 OAuth + JWT Authentication
* 🔥 Async Processing Pipeline
* 🔥 Production-Style Microservices
* 🔥 AI + Cybersecurity Combination
* 🔥 Dockerized End-to-End System
* 🔥 Local AI Processing
* 🔥 Enterprise-style Security Monitoring
* 🔥 Request Tracing and Auditability
* 🔥 HTTPS Gateway with Redirect
* 🔥 Persistent AI Chat Memory

---

# 📄 License

MIT License