# Architectural Decisions Record
**Feedback Widget SDK + Minimal Feedback API**

## Context
The requirements are to build:
1. A lightweight feedback widget embeddable in arbitrary websites and applications, usable both via module import and `<script>` tag.

2. A minimal backend service providing:
- Basic authentication
- Input validation
- A health check endpoint
- Persistent storage

Additionally, the SDK must:
- Generate and reuse a stable user identifier
- Expose a method to explicitly submit feedback to the backend API.

## Decision
**Frontend (SDK/Widget)**: 
The SDK is implemented as a vanilla TypeScript library built into ESM and IIFE outputs to support both modern bundlers and direct `<script>` embedding. The exposed interface consist of `init(projectId, apiKey, backendUrl?)`, `open()` and `submit({ rating, comment? })`.
The `userId` is generated on init and persisted in `localStorage` with a in-memory fallback in case that `localStorage` isn't available (session-scoped).

**Backend (API)**: The backend is implemented as a minimal Fastify service with a layered architecture: `router -> service -> repo`. 

This structure:
- Isolates HTTP concerns from business logic
- Makes validation and error handling explicit
- Enables easy persistence replacement or mocking for tests

Feedback is stored in a file-based SQLite database using Kysely.
SQLite was chosen for:
- Zero infrastructure overhead
- Deterministic local setup
- Sufficient performance for the expected scale

Kysely provides strong typing and safe query composition.

Authentication is handled via API key validation per request.

## Consecuences
- The API key is exposed client-side by design (browser environment).
It is used for tenant identification, not as a secret credential.

- SQLite limits horizontal scalability but is appropriate for the scope of this challenge.
- Layered architecture adds some abstraction overhead but improves:
    - Testability
    - Maintainability
    - Extensibility