# Portfolio AI Backend

An AI-powered backend service for my personal portfolio website. This project provides a reactive Gemini Live chat assistant that answers questions about Pranay Das' professional experience, skills, projects, resume, and technical expertise.

## Features

* WebSocket-based chat using native `ws`
* Gemini Live / Google GenAI integration
* Function-calling toolchain for precise knowledge-base lookup
* Reactive knowledge-base output from markdown sources
* Modular architecture for future RAG expansion
* Ready for VPS or cloud deployment

## Tech Stack

### Backend

* Node.js
* Express.js
* TypeScript

### AI

* Google GenAI Gemini Live
* Function calling via `searchKnowledge`

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
│   ├── controllers/
│   │   └── chat.controller.ts
│   │
│   ├── services/
│   │   └── gemini.service.ts
│   │
│   ├── knowledge/
│   │   ├── experience.md
│   │   ├── project_ckeditor_deepdive.md
│   │   ├── project_ngrx_deepdive.md
│   │   ├── project_presmistique_deepdive.md
│   │   └── projects_overview.md
│   │
│   ├── app.ts
│   └── server.ts
│
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
GEMINI_API_KEY=your_genai_api_key
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:4200
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

## WebSocket Chat Endpoint

This backend exposes a WebSocket upgrade endpoint at:

**`ws://<host>:<port>/api/chat`**

Clients should connect using a standard WebSocket client and send JSON messages like:

```json
{
  "type": "USER_MESSAGE",
  "text": "Tell me about your Angular experience"
}
```

The backend streams structured WebSocket events for live response delivery:

* `SYSTEM` - welcome and status messages
* `TEXT_CHUNK` - incremental model text output
* `AGENT_STEP` - function-call planning and observation progress
* `TURN_COMPLETE` - completion of a model turn
* `ERROR` - socket or session errors

## Architecture

```text
Angular Portfolio (frontend)
            │
            ▼
WebSocket client connects to
      ws://<host>:<port>/api/chat
            │
            ▼
Express + native WebSocket server
            │
            ▼
Gemini Live session with function calling
            │
            ▼
Reactive knowledge-base lookup
```

## Knowledge Base

The assistant sources responses from markdown files under:

```text
src/knowledge/
```

Example knowledge sources used by the live agent:

* `experience` → experience.md
* `ckeditor5` → project_ckeditor_deepdive.md
* `ngrx` → project_ngrx_deepdive.md
* `presmistique` → project_presmistique_deepdive.md
* `projects_overview` → projects_overview.md

The model is configured to answer only from tool-provided knowledge, making the response output precise and grounded.

## Roadmap

### Phase 1

* Reactive Gemini Live chat
* WebSocket streaming responses
* Function-calling knowledge lookup

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
* Configure CORS and allowed WebSocket origins only for trusted clients.
* Validate incoming WebSocket message payloads.
* Close sessions cleanly on disconnects and errors.

## Deployment

The backend is intended to run on a VPS while the frontend portfolio remains hosted separately.

```text
Frontend:
Cloudflare Pages

Backend:
Node.js + Express + Gemini Live
Hosted on VPS
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
