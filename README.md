# Feedback Widget

End‑to‑end solution for collecting user feedback via an embeddable widget (SDK) and a minimal backend API.

This repository contains:

- SDK – Vanilla TypeScript widget built as ES module + IIFE (script tag compatible)
- Backend API – Fastify + TypeScript service to receive and persist feedback

## ✨ Features

SDK

- Drop‑in widget via `<script>` tag or ES import
- Modal UI for rating (1–5) + optional comment
- Persistent anonymous userId (localStorage with memory fallback)
- Clear error handling (UI + console logs)
- Built in IIFE and ESM formats

Backend

- `POST /feedback` – stores feedback
- `GET /health` – service health check
- API‑Key authentication
- Payload validation
- SQLite persistence (Kysely ORM)

## 🔧 Prerequisites

- Node.js -> v22.x.x
- pnpm -> 10.x.x

## 📦 Tech Stack

Frontend

- TypeScript
- Vite (build)
- Vitest (tests)

Backend

- Node.js + TypeScript
- Fastify
- SQLite (better‑sqlite3)
- Kysely
- Vitest

## 🚀 Quick Start

From the project root run:

```bash
pnpm install & pnpm dev
```

This will:

- Start backedn API
- Build and watch SDK
- Serve demo page

Then open:

```text
http://localhost:5174
```

## 🔌 SDK Usage

### Script tag

```html
<script src="/dist/feedback-widget.iife.js"></script>
<script>
  FeedbackWidget.init({
    projectId: "demo-project",
    apiKey: "demo-key",
    backendUrl: "http://localhost:3001",
  });

  // open on button click
  document.getElementById("open").onclick = () => FeedbackWidget.open();
</script>
```

### ES module

```js
import { FeedbackWidget } from "feedback-widget";

FeedbackWidget.init({
  projectId: "demo-project",
  apiKey: "demo-key",
  backendUrl: "http://localhost:3001",
});

FeedbackWidget.open();
```

### Interface

The SDK exposes three methods:

- `init(config)` -> Initializes the SDK config, required for use
- `open` -> Opens feedback modal
- `submit({rating, comment?})` -> Submit feedback to the server

**Init**

```
FeedbackWidget.init({
    projectId: string,
    apiKey: string,
    backendUrl?: string,
})
```

Notes:

- `userId` is generated once and persisted in `localStorage` (in-memory fallback)
- The SDK automatically attaches projectId, userId, and an ISO timestamp when submitting

## Server

### `POST /feedback`

Request:

```json
{
  "projectId": "string",
  "userId": "string",
  "rating": 1,
  "comment": "optional",
  "timestamp": "2026-01-19T12:00:00Z"
}
```

Response:

```json
{
  "id": "string"
}
```

**CURL example**

```bash
curl -X POST http://localhost:3001/feedback \
  -H "Content-Type: application/json" \
  -H "x-api-key: demo-key" \
  -d '{
    "projectId": "demo-project",
    "userId": "user-123",
    "rating": 5,
    "comment": "Great experience!",
    "timestamp": "2026-01-19T12:00:00Z"
  }'
```

### `GET /health`

```json
{ "status": "ok" }
```

**CURL example**

```bash
curl http://localhost:3001/health
```

## Environment Variables

Create `server/.env`:

```
PORT=3001
API_KEY=demo-key
DB_FILE=./data/app.db
```

## 👤 Author

Santiago Morales
