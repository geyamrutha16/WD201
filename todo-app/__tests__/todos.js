const request = require("supertest");
const db = require("../models");
const app = require("../app");

describe("Todo Tests", () => {
    beforeAll(async () => {
        await db.sequelize.sync({ force: true });
    });

    test("Creates a todo and responds with json at /todos POST endpoint", async () => {
        const response = await request(app).post("/todos").send({
            title: "Test todo",
            dueDate: "2025-04-12",
        });
        expect(response.statusCode).toBe(201);
        expect(response.body.title).toBe("Test todo");
    });

    test("Fetches all todos in the database using /todos endpoint", async () => {
        const response = await request(app).get("/todos");
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    test("Marks a todo with the given ID as complete", async () => {
        const todo = await db.Todo.create({
            title: "Another todo",
            dueDate: "2025-04-13",
            completed: false,
        });
        const response = await request(app).put(`/todos/${todo.id}/markAsCompleted`);
        expect(response.statusCode).toBe(200);
        expect(response.body.completed).toBe(true);
    });

    test("Deletes a todo with the given ID if it exists and sends a boolean response", async () => {
        const todo = await db.Todo.create({
            title: "Todo to delete",
            dueDate: "2025-04-13",
            completed: false,
        });
        const response = await request(app).delete(`/todos/${todo.id}`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toBe(true);
    });
});
