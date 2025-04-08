const {
    todo,
    add,
    markAsComplete,
    overdue,
    dueToday,
    dueLater,
    toDisplayableList,
} = require("../todo");

const today = new Date();
const oneDayMs = 86400000;
const yesterday = new Date(today.getTime() - oneDayMs);
const tomorrow = new Date(today.getTime() + oneDayMs);

describe("Todo List Test Suite", () => {
    beforeAll(() => {
        // Seed some test data
        add({
            title: "Pay rent",
            dueDate: yesterday.toISOString().split("T")[0],
            completed: false,
        });
        add({
            title: "Service vehicle",
            dueDate: today.toISOString().split("T")[0],
            completed: false,
        });
        add({
            title: "File taxes",
            dueDate: tomorrow.toISOString().split("T")[0],
            completed: false,
        });
    });

    test("Should add a new todo", () => {
        const todoCount = todo.length;
        add({
            title: "New todo item",
            dueDate: today.toISOString().split("T")[0],
            completed: false,
        });
        expect(todo.length).toBe(todoCount + 1);
    });

    test("Should mark a todo as complete", () => {
        expect(todo[0].completed).toBe(false);
        markAsComplete(0);
        expect(todo[0].completed).toBe(true);
    });

    test("Should retrieve overdue items", () => {
        const overdueItems = overdue();
        expect(overdueItems.length).toBe(1);
        expect(overdueItems[0].title).toBe("Pay rent");
    });

    test("Should retrieve due today items", () => {
        const dueTodayItems = dueToday();
        expect(dueTodayItems.length).toBe(2); // Service vehicle + New todo item
        expect(dueTodayItems[0].title).toBe("Service vehicle");
    });

    test("Should retrieve due later items", () => {
        const dueLaterItems = dueLater();
        expect(dueLaterItems.length).toBe(1);
        expect(dueLaterItems[0].title).toBe("File taxes");
    });
});

describe("Displayable List Test Suite", () => {
    test("Should format overdue items correctly", () => {
        const overdueItems = overdue();
        const displayableList = toDisplayableList(overdueItems);
        expect(displayableList).toContain("[x] Pay rent");
        expect(displayableList).toContain(yesterday.toISOString().split("T")[0]);
    });

    test("Should format due today items correctly", () => {
        const dueTodayItems = dueToday();
        const displayableList = toDisplayableList(dueTodayItems);
        expect(displayableList).toContain("[ ] Service vehicle");
        expect(displayableList).not.toContain(today.toISOString().split("T")[0]); // Should omit date for today
    });

    test("Should format due later items correctly", () => {
        const dueLaterItems = dueLater();
        const displayableList = toDisplayableList(dueLaterItems);
        expect(displayableList).toContain("[ ] File taxes");
        expect(displayableList).toContain(tomorrow.toISOString().split("T")[0]);
    });
});