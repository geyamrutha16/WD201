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
        it('creates a todo and responds with json', async () => {
            const response = await request(app)
                .post('/todos')
                .send({
                    title: 'Test Todo',
                    dueDate: '2023-12-31'
                })
                .expect(200);

            expect(response.body.title).toBe('Test Todo');
            expect(response.body.dueDate).toBe('2023-12-31');
            expect(response.body.completed).toBe(false);
        });
    });

    describe('PUT /todos/:id/markAsComplete', () => {
        it('should return true when successfully marked complete', async () => {
            const todo = await db.Todo.create({ title: 'Test', dueDate: '2023-12-31' });
            const response = await request(app)
                .put(`/todos/${todo.id}/markAsComplete`)
                .expect(200);
            expect(response.body).toBe(true);
        });

        it('should return false for non-existent todo', async () => {
            const response = await request(app)
                .put('/todos/999/markAsComplete')
                .expect(404);
            expect(response.body).toBe(false);
        });
    });

    describe('GET /todos', () => {
        it('fetches all todos', async () => {
            await db.Todo.bulkCreate([
                { title: 'Todo 1', dueDate: '2023-01-01', completed: false },
                { title: 'Todo 2', dueDate: '2023-01-02', completed: true }
            ]);

            const response = await request(app)
                .get('/todos')
                .expect(200);

            expect(response.body.length).toBe(2);
            expect(response.body[0].title).toBe('Todo 1');
            expect(response.body[1].title).toBe('Todo 2');
        });
    });

    describe('DELETE /todos/:id', () => {
        it('deletes a todo and returns boolean response', async () => {
            const todo = await db.Todo.create({
                title: 'Test Todo',
                dueDate: '2023-12-31',
                completed: false
            });

            // Test successful deletion
            const deleteResponse = await request(app)
                .delete(`/todos/${todo.id}`)
                .expect(200);
            expect(deleteResponse.body).toBe(true);

            // Verify todo was deleted
            const getResponse = await request(app).get('/todos');
            expect(getResponse.body.length).toBe(0);

            // Test deletion of non-existent todo
            const nonExistentResponse = await request(app)
                .delete('/todos/999')
                .expect(200);
            expect(nonExistentResponse.body).toBe(false);
        });
    });
});