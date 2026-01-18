# Feedback API Server

Backend service for receiving user feedback from an embeddable widget / SDK.


**Features**:
- Secure feedback ingestion endpoint
- Payload validation
- Persistent storage (SQLite)
- Health check endpoint
- Automated test suite



## Tech Stack

- Node.js + TypeScript
- Fastify
- SQLite (better-sqlite3)
- Kysely (typed SQL)
- Vitest (testing)


## Architecture Overview
```text
src/
├─ app.ts # Fastify bootstrap
├─ routes/ # HTTP layer
├─ hooks/ # auth middleware
├─ services/ # business logic
├─ repos/ # DB access layer
├─ db/ # DB factory & schema
└─ plugins/ # Fastify plugins
```

**Layered design**
- Routes → Services → Repositories
- HTTP concerns are isolated from business logic
- DB access is encapsulated and mockable


## Setup

### 1) Install dependencies
```bash
pnpm install
```
### 2) Environment variables
Create `.env` inside `server/`

```env
PORT=<SERVER_PORT>
API_KEY=<REQUIRED_API_KEY>
DB_FILE=<SQLITE_FILE_PATH>
PROJECT_ID=<REQUIRED_PROJECT_ID>
```

## Run locally
```bash
pnpm dev
```
Server will start at: `http://localhost:3000`

## API
### Health check
```bash
GET /health
```
Response:
```json
{ "status": "ok" }
```
### Create feedback
```bash
POST /feedback
```
Headers:
```
x-api-key: <API_KEY>
```
Body:
```json
{
  "projectId": "demo",
  "userId": "user-123",
  "rating": 5,
  "comment": "Optional text",
  "timestamp": "2026-01-01T00:00:00.000Z"
}
```
**Validation rules**

- **projectId**: required, string
- **userId**: required, string
- **rating**: required, integer (1–5)
- **comment**: optional string
- **timestamp**: required ISO date

**Responses**
| HTTP Status                   | When it happens                                              | Response body                                            |
| ----------------------------- | ------------------------------------------------------------ | -------------------------------------------------------- |
| **201 Created**               | Feedback stored successfully                                 | ` { "id": "uuid" } `                                 |
| **400 Bad Request**           | Business rule failure returned by service                    | ` { "error": { "code": "<REASON>" } } `              |
| **400 Bad Request**           | Invalid request payload (schema validation)                  | Fastify validation error                                 |
| **401 Unauthorized**          | Missing/invalid Bearer token OR token does not match project | ` { "error": { "code": "UNAUTHORIZED" } } `          |
| **409 Conflict**              | Database constraint violation                                | ` { "error": { "code": "CONFLICT" } } `              |
| **503 Service Unavailable**   | Database locked / temporarily unavailable                    | ` { "error": { "code": "TEMPORARY_UNAVAILABLE" } } ` |
| **500 Internal Server Error** | Unexpected internal error                                    | ` { "error": { "code": "INTERNAL" } } `              |


**Manual testing**
```bash
curl -i http://localhost:3000/feedback \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_KEY" \
  -d '{
    "projectId": "'"$PROJECT_ID"'",
    "userId": "user-123",
    "rating": 5,
    "comment": "Great product",
    "timestamp": "2026-01-01T00:00:00.000Z"
  }'

```
## Authentication Details
This challenge implementation supports a single configured project (PROJECT_ID) and its API key (API_KEY). Requests must send that same projectId and key.

Request must include the API key using Bearer authentication or `x-api-key` header:
```
Authorization: Bearer <PROJECT_API_KEY>
```
```
    x-api-key: <API_KEY>
```
## Database
- SQLite file storage
- Auto-created on startup
- Table: 
```
feedback
 ├─ id
 ├─ project_id
 ├─ user_id
 ├─ rating
 ├─ comment
 └─ saved_at
 ```

## Error codes:

| Code                    | Description                            |
| ----------------------- | -------------------------------------- |
| `UNAUTHORIZED`          | Invalid or missing Bearer token        |
| `CONFLICT`              | Duplicate or constraint violation      |
| `TEMPORARY_UNAVAILABLE` | DB locked / temporary outage           |
| `INTERNAL`              | Unexpected server error                |
| `<CUSTOM>`              | Business rule defined by service layer |
