const path = require('path');
const express = require('express');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// In-memory task storage (resets on cold start / redeploy)
let tasks = [];
let nextId = 1;

// Get all tasks
app.get('/api/tasks', (req, res) => {
  res.json(tasks);
});

// Add a task
app.post('/api/tasks', (req, res) => {
  const text = (req.body.text || '').trim();
  if (!text) {
    return res.status(400).json({ error: 'Task text is required' });
  }
  const task = { id: nextId++, text, completed: false };
  tasks.push(task);
  res.status(201).json(task);
});

// Toggle a task's completed status
app.patch('/api/tasks/:id', (req, res) => {
  const task = tasks.find(t => t.id === Number(req.params.id));
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  task.completed = !task.completed;
  res.json(task);
});

// Delete a task
app.delete('/api/tasks/:id', (req, res) => {
  const before = tasks.length;
  tasks = tasks.filter(t => t.id !== Number(req.params.id));
  if (tasks.length === before) {
    return res.status(404).json({ error: 'Task not found' });
  }
  res.status(204).end();
});

module.exports = app;
