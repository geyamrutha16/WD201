const request = require('supertest');
const app = require('../app');
const db = require('../models');

describe('Todo API', () => {
    beforeAll(async () => {
        await db.sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await db.sequelize.close();
    });

    describe('POST /todos', () => {
        it('should create a new todo', async () => {
            const response = await request(app)
                .post('/todos')
                .send({
                    title: 'Test Todo',
                    dueDate: '2023-12-31'
                })
                .expect(201);

            expect(response.body.title).toBe('Test Todo');
            expect(response.body.dueDate).toBe('2023-12-31');
            expect(response.body.completed).toBe(false);
        });
    });

    describe('GET /todos', () => {
        it('should fetch all todos', async () => {
            await db.Todo.create({
                title: 'Test Todo 1',
                dueDate: '2023-12-31',
                completed: false
            });

            const response = await request(app)
                .get('/todos')
                .expect(200);

            expect(response.body.length).toBe(1);
            expect(response.body[0].title).toBe('Test Todo 1');
        });
    });

    describe('PUT /todos/:id/markAsComplete', () => {
        it('should mark a todo as complete', async () => {
            const todo = await db.Todo.create({
                title: 'Test Todo',
                dueDate: '2023-12-31',
                completed: false
            });

            const response = await request(app)
                .put(`/todos/${todo.id}/markAsComplete`)
                .expect(200);

            expect(response.body).toBe(true);

            // Verify in database
            const updatedTodo = await db.Todo.findByPk(todo.id);
            expect(updatedTodo.completed).toBe(true);
        });

        it('should return false for non-existent todo', async () => {
            const response = await request(app)
                .put('/todos/999/markAsComplete')
                .expect(404);

            expect(response.body).toBe(false);
        });
    });

    describe('DELETE /todos/:id', () => {
        it('should delete a todo and return true', async () => {
            const todo = await db.Todo.create({
                title: 'Test Todo',
                dueDate: '2023-12-31',
                completed: false
            });

            const response = await request(app)
                .delete(`/todos/${todo.id}`)
                .expect(200);

            expect(response.body).toBe(true);
        });

        it('should return false for non-existent todo', async () => {
            const response = await request(app)
                .delete('/todos/999')
                .expect(200);

            expect(response.body).toBe(false);
        });
    });
});