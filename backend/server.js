import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// create app
const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TODOS_DIR = path.join(__dirname, "todos");

// Ensure todos folder exists
if (!fs.existsSync(TODOS_DIR)) {
  fs.mkdirSync(TODOS_DIR);
}

app.use(cors());
app.use(bodyParser.json());

// GET for fetch
app.get("/api/todos", (req, res) => {
  const files = fs.readdirSync(TODOS_DIR);
  const todos = files.map((file) => {
    const content = fs.readFileSync(path.join(TODOS_DIR, file));
    return JSON.parse(content);
  });
  res.json(todos);
});

// POST for creation
app.post("/api/todos", (req, res) => {
  const id = Date.now();
  const newTodo = { id, text: req.body.text, completed: false };
  fs.writeFileSync(path.join(TODOS_DIR, `${id}.json`), JSON.stringify(newTodo, null, 2));
  res.status(201).json(newTodo);
});

// PATCH for update. Can use post for override
app.patch("/api/todos/:id", (req, res) => {
  const id = req.params.id;
  const filePath = path.join(TODOS_DIR, `${id}.json`);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "Todo not found" });
  }

  const existing = JSON.parse(fs.readFileSync(filePath));

  const updated = {
    ...existing,
    ...req.body,
  };

  fs.writeFileSync(filePath, JSON.stringify(updated, null, 2));
  res.json(updated);
});

// DELETE for deletion
app.delete("/api/todos/:id", (req, res) => {
  const id = req.params.id;
  const filePath = path.join(TODOS_DIR, `${id}.json`);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    res.json({ message: "Todo deleted" });
  } else {
    res.status(404).json({ error: "Todo not found" });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));