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

router.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken(); // Make available to all views
    next();
});

// In your POST route
router.post('/todos', csrfProtection, async (req, res) => {
    try {
        // Validation
        if (!req.body.title || req.body.title.trim() === '') {
            return res.status(400).send('Title is required');
        }
        if (!req.body.dueDate) {
            return res.status(400).send('Due date is required');
        }

        // Create todo
        await Todo.create({
            title: req.body.title.trim(),
            dueDate: req.body.dueDate,
            completed: false
        });

        res.redirect('/');
    } catch (error) {
        res.status(500).send('Error creating todo');
    }
});

router.post('/todos/:id', csrfProtection, async (req, res) => {
    try {
        const todo = await Todo.findByPk(req.params.id);
        if (!todo) {
            return res.status(404).json({ error: 'Todo not found' });
        }

        await todo.update({
            title: req.body.title,
            dueDate: req.body.dueDate
        });

        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.put('/todos/:id', csrfProtection, async (req, res) => {
    try {
        const todo = await Todo.findByPk(req.params.id);
        if (!todo) {
            return res.status(404).json({ error: 'Todo not found' });
        }

        await todo.update({ completed: !todo.completed });

        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
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
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/todos/:id/edit', csrfProtection, async (req, res) => { // Add csrfProtection
    try {
        const todo = await Todo.findByPk(req.params.id);
        if (!todo) return res.status(404).send('Todo not found');
        todo.dueDate = new Date(todo.dueDate);
        res.render('edit', {
            todo,
            csrfToken: req.csrfToken() // Explicitly pass
        });
    } catch (error) {
        res.status(500).send('Server error');
    }
});


module.exports = router;