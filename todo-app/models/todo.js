"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Todo extends Model {
        static associate(models) { }

        static async getTodos() {
            return await this.findAll();
        }

        static async addTodo({ title, dueDate }) {
            return await this.create({ title, dueDate, completed: false });
        }

        static async markAsCompleted(id) {
            const todo = await this.findByPk(id);
            if (todo) {
                todo.completed = true;
                await todo.save();
            }
            return todo;
        }

        static async remove(id) {
            const deleted = await this.destroy({ where: { id } });
            return deleted > 0;
        }
    }

    Todo.init(
        {
            title: DataTypes.STRING,
            dueDate: DataTypes.DATEONLY,
            completed: DataTypes.BOOLEAN,
        },
        {
            sequelize,
            modelName: "Todo",
        }
    );
    return Todo;
};
