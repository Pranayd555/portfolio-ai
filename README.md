# Portfolio AI Backend

An AI-powered backend service for my personal portfolio website. This project provides an intelligent chat assistant that can answer questions about my professional experience, skills, projects, resume, and technical expertise.

## Features

* AI-powered chat assistant
* REST API built with Express.js and TypeScript
* GOOGLE GENAI API integration
* Modular architecture for future scalability
* Knowledge-base driven responses
* Ready for RAG (Retrieval Augmented Generation)
* Easily deployable on VPS or cloud environments

## Tech Stack

### Backend

* Node.js
* Express.js
* TypeScript

### AI

* GOOGLE GENAI API

### Infrastructure

* VPS Hosting
* Docker (future support)
* Cloudflare (frontend hosting)

## Project Structure

```text
portfolio-ai-backend/
│
├── src/
│   ├── config/
│   │   └── env.ts
│   │
│   ├── routes/
│   │   └── chat.routes.ts
│   │
│   ├── controllers/
│   │   └── chat.controller.ts
│   │
│   ├── services/
│   │   ├── openai.service.ts
│   │   ├── rag.service.ts
│   │   └── vector.service.ts
│   │
│   ├── middleware/
│   │   ├── error.middleware.ts
│   │   └── logger.middleware.ts
│   │
│   ├── knowledge/
│   │   ├── resume.md
│   │   ├── projects.md
│   │   └── faq.md
│   │
│   ├── app.ts
│   └── server.ts
│
├── scripts/
│   └── ingest.ts
│
├── .env
├── package.json
├── tsconfig.json
└── README.md
```

## Installation

### Clone the Repository

```bash
git clone <repository-url>
cd portfolio-ai-backend
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create a `.env` file in the root directory.

```env
PORT=3000
GENAI_API_KEY=your_genai_api_key
NODE_ENV=development
```

## Running the Application

### Development Mode

```bash
npm run dev
```

### Build Project

```bash
npm run build
```

### Production Mode

```bash
npm start
```

## API Endpoints

### Chat Endpoint

**POST** `/api/chat`

#### Request

```json
{
  "message": "Tell me about your Angular experience"
}
```

#### Response

```json
{
  "success": true,
  "answer": "I have 8 years of experience working with Angular..."
}
```

## Architecture

```text
Angular Portfolio (Cloudflare)
            │
            ▼
      Express API
            │
            ▼
      OpenAI Service
            │
            ▼
     Knowledge Base
```

## Knowledge Base

The assistant can be trained using markdown files stored under:

```text
src/knowledge/
```

Example:

* resume.md
* projects.md
* skills.md
* experience.md
* faq.md

These files will later be indexed and used for semantic search through a vector database.

## Roadmap

### Phase 1

* Basic AI chatbot
* OpenAI integration
* Portfolio Q&A

### Phase 2

* Vector database integration
* Semantic search
* RAG implementation

### Phase 3

* Conversation memory
* Analytics dashboard
* Visitor insights

## Security Considerations

* Never expose API keys in frontend applications.
* Store secrets using environment variables.
* Configure CORS to allow only trusted origins.
* Implement rate limiting before production deployment.
* Validate all incoming request payloads.

## Deployment

The backend is intended to run on a VPS while the frontend portfolio remains hosted separately.

```text
Frontend:
Cloudflare Pages

Backend:
Node.js + Express
Hosted on VPS

AI:
OpenAI API
```

## Author

Pranay Das

Senior Software Engineer

Specializations:

* Angular
* React
* Node.js
* AWS
* AI-powered applications
