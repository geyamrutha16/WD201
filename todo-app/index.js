const app = require('./app');
const db = require('./models');

const PORT = process.env.PORT || 3000;

// Initialize database connection and start server
db.sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});