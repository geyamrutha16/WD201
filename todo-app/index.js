const app = require("./app");
const { sequelize } = require("./models");

const port = process.env.PORT || 3000;

sequelize.sync().then(() => {
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
});
