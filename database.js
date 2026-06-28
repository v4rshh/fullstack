const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "data");
const DATABASE_FILE = path.join(DATA_DIR, "tasks.json");

const seedTasks = [
  {
    id: 1,
    title: "Polish mobile navigation",
    summary: "Refine tap targets, active states, and collapsed menu behavior.",
    category: "design",
    status: "done",
  },
  {
    id: 2,
    title: "Build responsive card grid",
    summary: "Use fluid columns so dashboards stay readable on small screens.",
    category: "dev",
    status: "active",
  },
  {
    id: 3,
    title: "Add form validation",
    summary: "Give instant feedback for empty fields and invalid email formats.",
    category: "dev",
    status: "warning",
  },
  {
    id: 4,
    title: "Prepare accessibility pass",
    summary: "Check contrast, focus rings, labels, and keyboard-only flows.",
    category: "design",
    status: "active",
  },
];

function ensureDatabase() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DATABASE_FILE)) {
    writeDatabase({ lastId: seedTasks.length, tasks: seedTasks });
  }
}

function readDatabase() {
  ensureDatabase();
  const raw = fs.readFileSync(DATABASE_FILE, "utf8");
  return JSON.parse(raw);
}

function writeDatabase(database) {
  fs.writeFileSync(DATABASE_FILE, `${JSON.stringify(database, null, 2)}\n`);
}

function listTasks() {
  return readDatabase().tasks;
}

function findTask(id) {
  return listTasks().find((task) => task.id === id) || null;
}

function createTask(taskInput) {
  const database = readDatabase();
  const task = {
    id: database.lastId + 1,
    title: taskInput.title,
    summary: taskInput.summary || "Newly created task ready for planning and assignment.",
    category: taskInput.category,
    status: taskInput.status || "active",
  };

  database.lastId = task.id;
  database.tasks = [task, ...database.tasks];
  writeDatabase(database);

  return task;
}

function updateTask(id, changes) {
  const database = readDatabase();
  const taskIndex = database.tasks.findIndex((task) => task.id === id);

  if (taskIndex === -1) {
    return null;
  }

  database.tasks[taskIndex] = {
    ...database.tasks[taskIndex],
    ...changes,
    id,
  };
  writeDatabase(database);

  return database.tasks[taskIndex];
}

function deleteTask(id) {
  const database = readDatabase();
  const initialCount = database.tasks.length;

  database.tasks = database.tasks.filter((task) => task.id !== id);

  if (database.tasks.length === initialCount) {
    return false;
  }

  writeDatabase(database);
  return true;
}

module.exports = {
  createTask,
  deleteTask,
  ensureDatabase,
  findTask,
  listTasks,
  updateTask,
};
