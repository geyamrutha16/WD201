const request = require('supertest');
const app = require('../app');
const db = require('../models');

describe('DELETE /todos/:id', () => {
    let testTodo;

    beforeAll(async () => {
        // Create a test todo before running tests
        testTodo = await db.Todo.create({
            title: 'Test Todo',
            dueDate: new Date().toISOString().split('T')[0],
            completed: false
        });
    });

    afterAll(async () => {
        // Clean up database after tests
        await db.sequelize.close();
    });

    it('should delete an existing todo and return true', async () => {
        const response = await request(app)
            .delete(`/todos/${testTodo.id}`)
            .expect(200);

        expect(response.body).toBe(true);

        // Verify the todo was actually deleted
        const deletedTodo = await db.Todo.findByPk(testTodo.id);
        expect(deletedTodo).toBeNull();
    });

    it('should return false when trying to delete a non-existent todo', async () => {
        const nonExistentId = 9999;
        const response = await request(app)
            .delete(`/todos/${nonExistentId}`)
            .expect(200);

        expect(response.body).toBe(false);
    });

    it('should return 400 for invalid ID format', async () => {
        const response = await request(app)
            .delete('/todos/invalid')
            .expect(400);

        expect(response.body.error).toBe('Invalid ID');
    });
});

describe('GET /todos', () => {
    beforeAll(async () => {
        // Create test data
        await db.Todo.bulkCreate([
            {
                title: 'First Todo',
                dueDate: '2023-01-01',
                completed: false
            },
            {
                title: 'Second Todo',
                dueDate: '2023-01-02',
                completed: true
            }
        ]);
    });

    afterAll(async () => {
        await db.Todo.destroy({ where: {} });
    });

    it('should return all todos ordered by ID', async () => {
        const response = await request(app)
            .get('/todos')
            .expect(200);

        expect(response.body.length).toBe(2);
        expect(response.body[0].title).toBe('First Todo');
        expect(response.body[1].title).toBe('Second Todo');
        expect(response.body[0].id).toBeLessThan(response.body[1].id);
    });
});