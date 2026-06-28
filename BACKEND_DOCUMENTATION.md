# Backend Documentation

## Overview

The FlowDesk backend connects the dashboard frontend to persistent task storage. It uses only built-in Node.js modules and stores data in a JSON database file at `backend/data/tasks.json`.

## Folder Organization

```text
FlowDesk/
  frontend/
    index.html
    script.js
    styles.css
  backend/
    data/
      tasks.json
    database.js
    server.js
    package.json
```

The backend serves static files from `frontend/` and handles API requests under `/api/`.

## Database Schema

```json
{
  "lastId": 4,
  "tasks": [
    {
      "id": 1,
      "title": "Polish mobile navigation",
      "summary": "Refine tap targets, active states, and collapsed menu behavior.",
      "category": "design",
      "status": "done"
    }
  ]
}
```

The `lastId` field keeps newly created task IDs unique. The `tasks` array stores the task records used by the dashboard.

## API Routes

### GET /api/tasks

Returns every saved task.

### GET /api/tasks/:id

Returns one task by numeric ID.

### POST /api/tasks

Creates a task. Required body:

```json
{
  "title": "Connect backend API",
  "category": "dev"
}
```

Optional fields:

```json
{
  "summary": "Short task details",
  "status": "active"
}
```

### PUT /api/tasks/:id

Updates editable fields for one task. Use this when sending the main task fields together.

### PATCH /api/tasks/:id

Updates selected fields for one task. The frontend uses this route to mark a task complete:

```json
{
  "status": "done"
}
```

### DELETE /api/tasks/:id

Deletes one task by ID.

## Validation

- `title` cannot be empty and must be 80 characters or fewer.
- `summary` must be 140 characters or fewer.
- `category` must be `design` or `dev`.
- `status` must be `active`, `done`, or `warning`.
- Invalid JSON receives a `400` response.
- Missing task IDs receive a `404` response.

## Frontend Integration

The frontend loads tasks with `GET /api/tasks`, creates tasks with `POST /api/tasks`, marks tasks complete with `PATCH /api/tasks/:id`, and deletes tasks with `DELETE /api/tasks/:id`.
