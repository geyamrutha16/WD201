const express = require("express");
const app = express();
const { Todo } = require("./models");

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Welcome to the Todo App!");
});

app.get("/todos", async (req, res) => {
    const todos = await Todo.getTodos();
    res.json(todos);
});

app.post("/todos", async (req, res) => {
    const { title, dueDate } = req.body;
    try {
        const todo = await Todo.addTodo({ title, dueDate });
        res.status(201).json(todo);
    } catch (error) {
        res.status(500).json({ error: "Something went wrong" });
    }
});

app.put("/todos/:id/markAsCompleted", async (req, res) => {
    try {
        const todo = await Todo.markAsCompleted(req.params.id);
        if (todo) {
            res.json(todo);
        } else {
            res.status(404).send("Todo not found");
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.delete("/todos/:id", async (req, res) => {
    try {
        const result = await Todo.remove(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(500).json(false);
    }
});

module.exports = app;
