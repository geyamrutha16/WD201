const request = require("supertest");
const db = require("../models");
const app = require("../app");

describe("Todo Test Suite", () => {
    beforeAll(async () => {
        await db.sequelize.sync({ force: true });
    });

    test("Creates a todo and responds with redirect", async () => {
        const response = await request(app)
            .post("/todos")
            .send({
                title: "Test todo",
                dueDate: "2025-04-15",
                _csrf: "test-csrf-token"
            });
        expect(response.statusCode).toBe(302);
    });

    test("Fails to create todo with empty title", async () => {
        const response = await request(app)
            .post("/todos")
            .send({
                title: "",
                dueDate: "2025-04-15",
                _csrf: "test-csrf-token"
            });
        expect(response.statusCode).toBe(400);
    });

    test("Updates a todo's completion status", async () => {
        const todo = await db.Todo.create({
            title: "Test todo",
            dueDate: "2025-04-16",
            completed: false
        });

        const response = await request(app)
            .put(`/todos/${todo.id}`)
            .send({
                completed: true,
                _csrf: "test-csrf-token"
            });

        expect(response.statusCode).toBe(200);
        const updatedTodo = await db.Todo.findByPk(todo.id);
        expect(updatedTodo.completed).toBe(true);
    });

    test("Deletes a todo", async () => {
        const todo = await db.Todo.create({
            title: "Todo to delete",
            dueDate: "2025-04-17",
            completed: false
        });

        const response = await request(app)
            .delete(`/todos/${todo.id}`)
            .send({ _csrf: "test-csrf-token" });

        expect(response.statusCode).toBe(204);
        const deletedTodo = await db.Todo.findByPk(todo.id);
        expect(deletedTodo).toBeNull();
    });

    afterAll(async () => {
        await db.sequelize.close();
    });
});