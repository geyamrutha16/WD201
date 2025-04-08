'use strict';
const {
    Model
} = require('sequelize');
const { Op } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Todo extends Model {
        static async addTask(params) {
            return await Todo.create(params);
        }

        static async showList() {
            console.log("My Todo list \n");

            console.log("Overdue");
            const overdueItems = await this.overdue();
            overdueItems.forEach(item => console.log(item.displayableString()));

            console.log("\nDue Today");
            const dueTodayItems = await this.dueToday();
            dueTodayItems.forEach(item => console.log(item.displayableString()));

            console.log("\nDue Later");
            const dueLaterItems = await this.dueLater();
            dueLaterItems.forEach(item => console.log(item.displayableString()));
        }

        static async overdue() {
            const today = new Date().toISOString().split('T')[0];
            return await Todo.findAll({
                where: {
                    dueDate: { [Op.lt]: today }
                },
                order: [['dueDate', 'ASC']]
            });
        }

        static async dueToday() {
            const today = new Date().toISOString().split('T')[0];
            return await Todo.findAll({
                where: {
                    dueDate: today
                },
                order: [['id', 'ASC']]
            });
        }

        static async dueLater() {
            const today = new Date().toISOString().split('T')[0];
            return await Todo.findAll({
                where: {
                    dueDate: { [Op.gt]: today }
                },
                order: [['dueDate', 'ASC']]
            });
        }

        static async markAsComplete(id) {
            await Todo.update(
                { completed: true },
                { where: { id } }
            );
            return this.findByPk(id);
        }

        displayableString() {
            const today = new Date().toISOString().split('T')[0];
            const checkbox = this.completed ? "[x]" : "[ ]";
            const displayDate = (this.dueDate === today || (this.completed && this.dueDate >= today))
                ? ''
                : ` ${this.dueDate}`;
            return `${this.id}. ${checkbox} ${this.title.trim()}${displayDate}`;
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