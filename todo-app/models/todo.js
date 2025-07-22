module.exports = (sequelize, DataTypes) => {
    const Todo = sequelize.define('Todo', {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        dueDate: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        completed: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    });

    Todo.prototype.setCompletionStatus = function (status) {
        return this.update({ completed: status });
    };

    return Todo;
};