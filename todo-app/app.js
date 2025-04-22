const express = require('express');
const path = require('path');
const { Todo } = require('./models');
const bodyParser = require('body-parser');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Routes
app.get('/', async (req, res) => {
    try {
        const todos = await Todo.findAll({
            order: [['dueDate', 'ASC']]
        });
        res.render('index', { todos });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

app.post('/todos', async (req, res) => {
    try {
        await Todo.create({
            title: req.body.title,
            dueDate: req.body.dueDate,
            completed: false
        });
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

app.put('/todos/:id', async (req, res) => {
    try {
        const todo = await Todo.findByPk(req.params.id);
        todo.completed = !todo.completed;
        await todo.save();
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false });
    }
});

module.exports = app;