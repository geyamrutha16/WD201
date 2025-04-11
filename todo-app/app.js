const express = require("express");
const app = express();
const { Todo } = require("./models");

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Todo App running");
});

app.get("/todos", async (req, res) => {
    try {
        const todos = await Todo.findAll({ order: [["id", "ASC"]] });
        return res.status(200).json(todos);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

app.post("/todos", async (req, res) => {
    try {
        const todo = await Todo.create({
            title: req.body.title,
            dueDate: req.body.dueDate,
            completed: false,
        });
        return res.status(201).json(todo);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

app.put("/todos/:id/markAsCompleted", async (req, res) => {
    try {
        const todo = await Todo.findByPk(req.params.id);
        if (todo) {
            todo.completed = true;
            await todo.save();
            return res.status(200).json(todo);
        }
        return res.status(404).json({ error: "Todo not found" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

app.delete("/todos/:id", async (req, res) => {
    try {
        const deleted = await Todo.destroy({ where: { id: req.params.id } });
        return res.json(deleted > 0);
    } catch (error) {
        return res.status(500).json(false);
    }
});

module.exports = app;
