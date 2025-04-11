const app = require("../app");
const { sequelize } = require("./models");

const port = 3000;

sequelize.sync().then(() => {
    app.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`);
    });
});
