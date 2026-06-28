# FlowDesk Backend

This folder contains the Node.js backend for FlowDesk. It serves the `frontend` folder and provides database-backed CRUD endpoints for task data.

## Files

```text
backend/
  data/
    tasks.json
  database.js
  server.js
  package.json
  README.md
  BACKEND_DOCUMENTATION.md
```

## How to Run

From the main `FlowDesk` folder:

```bash
node backend/server.js
```

Or from inside the `backend` folder:

```bash
npm start
```

The app runs at:

```text
http://localhost:3000/
```

## API Endpoints

- `GET /api/tasks`: returns all tasks
- `GET /api/tasks/:id`: returns one task
- `POST /api/tasks`: creates a task
- `PUT /api/tasks/:id`: replaces editable task fields
- `PATCH /api/tasks/:id`: updates selected task fields
- `DELETE /api/tasks/:id`: deletes a task

## Validation

The backend checks that:

- `title` is required for new tasks and must be 80 characters or fewer.
- `summary` must be 140 characters or fewer when provided.
- `category` must be either `dev` or `design`.
- `status` must be `active`, `done`, or `warning`.
- Request bodies must be valid JSON.

## Database

Tasks are stored in `backend/data/tasks.json`. The database is created automatically with seed task data the first time the server starts.
