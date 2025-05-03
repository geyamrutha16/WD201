const express = require('express');
const path = require('path');
const { sequelize } = require('./models');

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
const todoRouter = require('./app');
app.use('/', todoRouter);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Database sync and server start
sequelize.sync()
    .then(() => {
        const PORT = process.env.PORT || 10000;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log(`Database connected: ${sequelize.config.host}`);
        });
    })
    .catch(err => {
        console.error('Database connection failed:', err);
        process.exit(1);
    });