const express = require('express');
const db = require('./models');
const app = express();

app.use(express.json());

// GET /todos - Get all todos
app.get('/todos', async (req, res) => {
    try {
        const todos = await db.Todo.findAll({
            order: [['id', 'ASC']] // Order by ID ascending
        });
        res.json(todos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// DELETE /todos/:id - Delete a todo by ID
app.delete('/todos/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid ID' });
        }

        const deletedCount = await db.Todo.destroy({
            where: { id }
        });

        // Return true if a record was deleted, false otherwise
        res.json(deletedCount > 0);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = app;