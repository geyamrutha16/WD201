const express = require('express');
const router = express.Router();
const { Todo } = require('./models');
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });

router.get('/', async (req, res) => {
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

        res.render('index', {
            todos,
            overdue,
            dueToday,
            dueLater,
            completed,
            today,
            csrfToken: req.csrfToken()
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

router.post('/todos', csrfProtection, async (req, res) => {
    try {
        if (!req.body.title || !req.body.dueDate) {
            return res.status(400).json({ error: 'Title and due date are required' });
        }

        await Todo.create({
            title: req.body.title,
            dueDate: req.body.dueDate,
            completed: false
        });
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating todo');
    }
});

router.put('/todos/:id', csrfProtection, async (req, res) => {
    try {
        const todo = await Todo.findByPk(req.params.id);
        if (!todo) return res.status(404).send('Todo not found');

        await todo.setCompletionStatus(req.body.completed);
        res.status(200).send();
    } catch (error) {
        console.error(error);
        res.status(500).send('Error updating todo');
    }
});

router.delete('/todos/:id', csrfProtection, async (req, res) => {
    try {
        const deleted = await Todo.destroy({
            where: { id: req.params.id }
        });
        if (deleted) return res.status(204).send();
        res.status(404).send('Todo not found');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error deleting todo');
    }
});

router.get('/todos/:id/edit', async (req, res) => {
    const id = req.params.id;
    try {
        const todo = await Todo.findByPk(id);
        if (!todo) {
            return res.status(404).send('Todo not found');
        }
        res.render('edit', { todo }); // Make sure edit.ejs exists
    } catch (error) {
        res.status(500).send('Server error');
    }
});


module.exports = router;