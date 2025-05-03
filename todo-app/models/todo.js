'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const Todo = sequelize.define('Todo', {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        dueDate: DataTypes.DATEONLY,
        completed: DataTypes.BOOLEAN
    }, {});
    return Todo;
};