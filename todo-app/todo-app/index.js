const express = require('express');
const path = require('path');
const { sequelize } = require('./models');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');

const app = express();
const csrfProtection = csrf({
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(methodOverride('_method'));
app.use(csrfProtection);
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const router = require('./app');
app.use('/', router);

async function initializeSampleData() {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    await Todo.bulkCreate([
        { title: 'Overdue Task', dueDate: yesterday.toISOString().split('T')[0], completed: false },
        { title: 'Today Task', dueDate: today, completed: false },
        { title: 'Later Task', dueDate: tomorrow.toISOString().split('T')[0], completed: false }
    ]);
}

async function startServer() {
    try {
        await sequelize.authenticate();
        await sequelize.sync({ force: true });
        await initializeSampleData();

        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();