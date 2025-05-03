const express = require('express');
const router = express.Router();
const { Todo } = require('./models');

// GET all todos
/*
router.get('/', async (req, res) => {
    try {
        const todos = await Todo.findAll({ order: [['dueDate', 'ASC']] });
        res.render('index', { todos });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});
*/

router.get('/', async (req, res) => {
    try {
        const todos = await Todo.findAll({
            order: [['dueDate', 'ASC']]
        });

        const today = new Date().toISOString().split('T')[0];

        const overdue = todos.filter(todo =>
            !todo.completed && todo.dueDate < today
        );
        const dueToday = todos.filter(todo =>
            !todo.completed && todo.dueDate === today
        );
        const dueLater = todos.filter(todo =>
            !todo.completed && todo.dueDate > today
        );

        res.render('index', {
            todos,
            overdue,
            dueToday,
            dueLater
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// POST new todo
router.post('/todos', async (req, res) => {
    try {
        if (!req.body.title) {
            return res.status(400).send('Title is required');
        }

        await Todo.create({
            title: req.body.title,
            dueDate: req.body.dueDate || null,
            completed: false
        });

        res.redirect('/');
    } catch (error) {
        console.error('Error creating todo:', error);
        res.status(500).send('Error creating todo');
    }
});

// DELETE route
router.delete('/todos/:id', async (req, res) => {
    try {
        const deleted = await Todo.destroy({
            where: { id: req.params.id }
        });
        if (deleted) {
            return res.status(204).send();
        }
        throw new Error('Todo not found');
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// EDIT route (GET)
router.get('/todos/:id/edit', async (req, res) => {
    try {
        const todo = await Todo.findByPk(req.params.id);
        if (!todo) {
            return res.status(404).send('Todo not found');
        }
        res.render('edit', { todo });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;