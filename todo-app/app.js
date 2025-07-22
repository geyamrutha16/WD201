const express = require('express');
const router = express.Router();
const { Todo } = require('./models');
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });

router.get('/', csrfProtection, async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const todos = await Todo.findAll({ order: [['dueDate', 'ASC']] });

        const overdue = todos.filter(todo =>
            !todo.completed && todo.dueDate < today
        );
        const dueToday = todos.filter(todo =>
            !todo.completed && todo.dueDate === today
        );
        const dueLater = todos.filter(todo =>
            !todo.completed && todo.dueDate > today
        );
        const completed = todos.filter(todo => todo.completed);

        res.render('todos', {
            overdue,
            dueToday,
            dueLater,
            completed,
            csrfToken: req.csrfToken()
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

router.post('/todos', csrfProtection, async (req, res) => {
    try {
        if (!req.body.title || req.body.title.trim() === '') {
            return res.status(400).json({ error: 'Title is required' });
        }
        if (!req.body.dueDate) {
            return res.status(400).json({ error: 'Due date is required' });
        }

        await Todo.create({
            title: req.body.title.trim(),
            dueDate: req.body.dueDate,
            completed: false
        });

        res.redirect('/');
    } catch (error) {
        res.status(500).json({ error: 'Error creating todo' });
    }
});

router.put('/todos/:id', csrfProtection, async (req, res) => {
    try {
        const todo = await Todo.findByPk(req.params.id);
        if (!todo) {
            return res.status(404).json({ error: 'Todo not found' });
        }

        await todo.update({ completed: req.body.completed });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update todo' });
    }
});

router.delete('/todos/:id', csrfProtection, async (req, res) => {
    try {
        const todo = await Todo.findByPk(req.params.id);
        if (!todo) {
            return res.status(404).json({ error: 'Todo not found' });
        }

        await todo.destroy();
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete todo' });
    }
});

module.exports = router;