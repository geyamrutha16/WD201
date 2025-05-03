const request = require("supertest");
const db = require("../models");
const app = require("../app");

describe("Todo Test Suite", () => {
    beforeAll(async () => {
        await db.sequelize.sync({ force: true });
    });

    test("Creates a todo and responds with redirect at /todos POST endpoint", async () => {
        const response = await request(app)
            .post("/todos")
            .send({
                title: "Test todo",
                dueDate: "2025-04-15",
                _csrf: "test-csrf-token" // Add CSRF token for testing
            });
        expect(response.statusCode).toBe(302); // Should redirect after creation
    });

    test("Fetches all todos in the database using / endpoint", async () => {
        const response = await request(app).get("/");
        expect(response.statusCode).toBe(200);
    });

    test("Updates a todo's completion status with PUT /todos/:id", async () => {
        const todo = await db.Todo.create({
            title: "Todo to update",
            dueDate: "2025-04-16",
            completed: false,
        });
        const response = await request(app)
            .put(`/todos/${todo.id}`)
            .send({
                completed: true,
                _csrf: "test-csrf-token"
            });
        expect(response.statusCode).toBe(200);

        // Verify the update
        const updatedTodo = await db.Todo.findByPk(todo.id);
        expect(updatedTodo.completed).toBe(true);
    });

    test("Deletes a todo with the given ID if it exists", async () => {
        const todo = await db.Todo.create({
            title: "Todo to delete",
            dueDate: "2025-04-17",
            completed: false,
        });
        const response = await request(app)
            .delete(`/todos/${todo.id}`)
            .set('Cookie', ['XSRF-TOKEN=test-csrf-token'])
            .send({ _csrf: "test-csrf-token" });
        expect(response.statusCode).toBe(204);

        // Verify deletion
        const deletedTodo = await db.Todo.findByPk(todo.id);
        expect(deletedTodo).toBeNull();
    });

    test("Fails to create todo with empty title or dueDate", async () => {
        const response1 = await request(app)
            .post("/todos")
            .send({
                title: "",
                dueDate: "2025-04-18",
                _csrf: "test-csrf-token"
            });
        expect(response1.statusCode).toBe(400);

        const response2 = await request(app)
            .post("/todos")
            .send({
                title: "No date",
                dueDate: "",
                _csrf: "test-csrf-token"
            });
        expect(response2.statusCode).toBe(400);
    });

    afterAll(async () => {
        await db.sequelize.close();
    });
});