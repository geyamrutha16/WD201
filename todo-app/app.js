const express = require('express');
const router = express.Router();
const { Todo } = require('./models');

// GET all todos
router.get('/', async (req, res) => {
    try {
        const todos = await Todo.findAll({ order: [['dueDate', 'ASC']] });
        res.render('index', { todos });
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

module.exports = router;