const todoList = require("../todo.js");

const { all, add, markAsComplete, overdue, dueToday, dueLater, toDisplayableList } = todoList();

describe("Todo List Test Suite", () => {
    beforeAll(() => {
        // Add some initial todos for testing
        add({ title: "Submit assignment", dueDate: "2023-12-25", completed: false });
        add({ title: "Pay rent", dueDate: "2023-12-31", completed: false });
        add({ title: "Service Vehicle", dueDate: "2023-12-31", completed: false });
        add({ title: "File taxes", dueDate: "2024-01-01", completed: false });
        add({ title: "Pay electric bill", dueDate: "2024-01-01", completed: false });
    });

    test("Should add a new todo", () => {
        const todoCount = all.length;
        add({ title: "New Todo", dueDate: "2023-12-31", completed: false });
        expect(all.length).toBe(todoCount + 1);
    });

    test("Should mark a todo as completed", () => {
        expect(all[0].completed).toBe(false);
        markAsComplete(0);
        expect(all[0].completed).toBe(true);
    });

    test("Should retrieve overdue items", () => {
        const today = new Date().toISOString().split("T")[0];
        const overdueItems = overdue();
        expect(overdueItems.length).toBe(1);
        expect(overdueItems[0].title).toBe("Submit assignment");
    });

    test("Should retrieve due today items", () => {
        const today = new Date().toISOString().split("T")[0];
        const dueTodayItems = dueToday();
        expect(dueTodayItems.length).toBe(2);
        expect(dueTodayItems[0].title).toBe("Pay rent");
        expect(dueTodayItems[1].title).toBe("Service Vehicle");
    });

    test("Should retrieve due later items", () => {
        const dueLaterItems = dueLater();
        expect(dueLaterItems.length).toBe(2);
        expect(dueLaterItems[0].title).toBe("File taxes");
        expect(dueLaterItems[1].title).toBe("Pay electric bill");
    });
});