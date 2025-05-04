const express = require('express');
const path = require('path');
const { sequelize } = require('./models');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');

const app = express();
//const csrfProtection = csrf({ cookie: true });
// Configure CSRF more securely
const csrfProtection = csrf({
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 3600 // 1 hour
    }
});
const methodOverride = require('method-override');

// Correct order in index.js
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(methodOverride('_method'));
app.use(csrfProtection);
// Setup CSRF protection

// Middleware setup
app.use(express.static(path.join(__dirname, 'public')));

// View engine configuration
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
const router = require('./app');
app.use('/', router);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Application error:', err.stack);
    res.status(500).send('Internal Server Error');
});

// Database and server initialization
async function startServer() {
    try {
        // Test database connection
        await sequelize.authenticate();
        console.log('Database connection established');

        // Sync models
        await sequelize.sync();
        console.log('Database synchronized');

        // Start server
        const PORT = process.env.PORT || 10000;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1); // Exit with failure code
    }
}

async function initializeSampleData() {
    const count = await Todo.count();
    if (count === 0) {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        await Todo.bulkCreate([
            { title: 'Overdue Task', dueDate: yesterday, completed: false },
            { title: 'Today Task', dueDate: today, completed: false },
            { title: 'Later Task', dueDate: tomorrow, completed: false }
        ]);
        console.log('Sample data created');
    }
}

// Start the application
startServer();
initializeSampleData();