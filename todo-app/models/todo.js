'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Todo extends Model {
        static associate(models) {
            // associations can be defined here
        }
    }
    Todo.init({
        title: DataTypes.STRING,
        dueDate: DataTypes.DATEONLY,
        completed: DataTypes.BOOLEAN
    }, {
        sequelize,
        modelName: 'Todo',
    });
    return Todo;
};