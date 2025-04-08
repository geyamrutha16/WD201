const express = require('express');
const db = require('./models');
const app = express();

app.use(express.json());

// POST /todos - Create a new todo
app.post('/todos', async (req, res) => {
    try {
        const todo = await db.Todo.create({
            title: req.body.title,
            dueDate: req.body.dueDate,
            completed: false
        });
        res.json(todo);
    } catch (error) {
        console.error(error);
        res.status(422).json({ error: 'Unable to create todo' });
    }
});

// GET /todos - Get all todos
app.get('/todos', async (req, res) => {
    try {
        const todos = await db.Todo.findAll({
            order: [['id', 'ASC']]
        });
        res.json(todos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// PUT /todos/:id/markAsComplete - Mark todo as complete
app.put('/todos/:id/markAsComplete', async (req, res) => {
    try {
        const todo = await db.Todo.findByPk(req.params.id);
        if (!todo) {
            return res.status(404).json(false);
        }

        await todo.update({ completed: true });
        res.json(true);
    } catch (error) {
        console.error(error);
        res.status(500).json(false);
    }
});

// DELETE /todos/:id - Delete a todo
app.delete('/todos/:id', async (req, res) => {
    try {
        const deletedCount = await db.Todo.destroy({
            where: { id: req.params.id }
        });
        res.json(deletedCount > 0);
    } catch (error) {
        console.error(error);
        res.status(500).json(false);
    }
});

module.exports = app;