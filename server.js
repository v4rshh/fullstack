const http = require("http");
const fs = require("fs");
const path = require("path");
const {
  createTask,
  deleteTask,
  ensureDatabase,
  findTask,
  listTasks,
  updateTask,
} = require("./database");

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, "..", "frontend");

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
};

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(payload));
}

function readRequestBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";

    request.on("data", (chunk) => {
      body += chunk;

      if (body.length > 10000) {
        reject(new Error("Request body is too large."));
        request.destroy();
      }
    });

    request.on("end", () => resolve(body));
    request.on("error", reject);
  });
}

function parseTaskId(pathname) {
  const match = pathname.match(/^\/api\/tasks\/(\d+)$/);
  return match ? Number(match[1]) : null;
}

function validateTask(input, options = {}) {
  const title = typeof input.title === "string" ? input.title.trim() : "";
  const category = typeof input.category === "string" ? input.category.trim().toLowerCase() : "";
  const summary = typeof input.summary === "string" ? input.summary.trim() : "";
  const status = typeof input.status === "string" ? input.status.trim().toLowerCase() : "";

  if (!options.partial && !title) {
    return { error: "Task title is required." };
  }

  if (title.length > 80) {
    return { error: "Task title must be 80 characters or fewer." };
  }

  if (category && !["design", "dev"].includes(category)) {
    return { error: "Category must be either design or dev." };
  }

  if (!options.partial && !category) {
    return { error: "Category must be either design or dev." };
  }

  if (summary.length > 140) {
    return { error: "Task summary must be 140 characters or fewer." };
  }

  if (status && !["active", "done", "warning"].includes(status)) {
    return { error: "Status must be active, done, or warning." };
  }

  const task = {};

  if (title) task.title = title;
  if (category) task.category = category;
  if (summary) task.summary = summary;
  if (status) task.status = status;

  return { task };
}

async function handleApi(request, response, pathname) {
  if (pathname === "/api/tasks" && request.method === "GET") {
    sendJson(response, 200, { tasks: listTasks() });
    return;
  }

  if (pathname === "/api/tasks" && request.method === "POST") {
    try {
      const rawBody = await readRequestBody(request);
      const payload = rawBody ? JSON.parse(rawBody) : {};
      const result = validateTask(payload);

      if (result.error) {
        sendJson(response, 400, { error: result.error });
        return;
      }

      sendJson(response, 201, { task: createTask(result.task) });
    } catch (error) {
      sendJson(response, 400, { error: "Request body must be valid JSON." });
    }
    return;
  }

  const taskId = parseTaskId(pathname);

  if (taskId && request.method === "GET") {
    const task = findTask(taskId);
    sendJson(response, task ? 200 : 404, task ? { task } : { error: "Task not found." });
    return;
  }

  if (taskId && (request.method === "PUT" || request.method === "PATCH")) {
    try {
      const rawBody = await readRequestBody(request);
      const payload = rawBody ? JSON.parse(rawBody) : {};
      const result = validateTask(payload, { partial: request.method === "PATCH" });

      if (result.error) {
        sendJson(response, 400, { error: result.error });
        return;
      }

      const task = updateTask(taskId, result.task);
      sendJson(response, task ? 200 : 404, task ? { task } : { error: "Task not found." });
    } catch (error) {
      sendJson(response, 400, { error: "Request body must be valid JSON." });
    }
    return;
  }

  if (taskId && request.method === "DELETE") {
    const deleted = deleteTask(taskId);
    sendJson(response, deleted ? 200 : 404, deleted ? { deleted: true } : { error: "Task not found." });
    return;
  }

  sendJson(response, 404, { error: "API endpoint not found." });
}

function serveStaticFile(response, pathname) {
  const requestedPath = pathname === "/" ? "/index.html" : pathname;
  const filePath = path.normalize(path.join(PUBLIC_DIR, requestedPath));
  const relativePath = path.relative(PUBLIC_DIR, filePath);

  if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Not found");
      return;
    }

    const extension = path.extname(filePath).toLowerCase();
    response.writeHead(200, {
      "Content-Type": contentTypes[extension] || "application/octet-stream",
    });
    response.end(content);
  });
}

const server = http.createServer((request, response) => {
  const url = new URL(request.url, `http://${request.headers.host}`);

  if (url.pathname.startsWith("/api/")) {
    handleApi(request, response, url.pathname);
    return;
  }

  serveStaticFile(response, decodeURIComponent(url.pathname));
});

ensureDatabase();

server.listen(PORT, () => {
  console.log(`FlowDesk backend running at http://localhost:${PORT}`);
});
