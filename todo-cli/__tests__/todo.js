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

const formatDate = (date) => date.toISOString().split("T")[0];

describe("Todo List Test Suite", () => {
    beforeEach(() => {
        // Clear todos before each test
        todo.length = 0;

        // Add test data
        add({
            title: "Pay rent",
            dueDate: formatDate(yesterday),
            completed: false,
        });
        add({
            title: "Service vehicle",
            dueDate: formatDate(today),
            completed: false,
        });
        add({
            title: "File taxes",
            dueDate: formatDate(tomorrow),
            completed: false,
        });
    });

    test("Should add a new todo", () => {
        const initialCount = todo.length;
        add({
            title: "New todo item",
            dueDate: formatDate(today),
        });
        expect(todo.length).toBe(initialCount + 1);
        expect(todo[todo.length - 1].title).toBe("New todo item");
        expect(todo[todo.length - 1].completed).toBe(false);
    });

    test("Should throw error when adding invalid todo", () => {
        expect(() => add({})).toThrow("Todo item must have title and dueDate");
    });

    test("Should mark a todo as complete", () => {
        expect(todo[0].completed).toBe(false);
        markAsComplete(0);
        expect(todo[0].completed).toBe(true);
    });

    test("Should throw error when marking invalid index as complete", () => {
        expect(() => markAsComplete(-1)).toThrow("Invalid index");
        expect(() => markAsComplete(999)).toThrow("Invalid index");
    });

    test("Should retrieve overdue items", () => {
        const overdueItems = overdue();
        expect(overdueItems).toHaveLength(1);
        expect(overdueItems[0].title).toBe("Pay rent");
    });

    test("Should retrieve due today items", () => {
        const dueTodayItems = dueToday();
        expect(dueTodayItems).toHaveLength(1);
        expect(dueTodayItems[0].title).toBe("Service vehicle");
    });

    test("Should retrieve due later items", () => {
        const dueLaterItems = dueLater();
        expect(dueLaterItems).toHaveLength(1);
        expect(dueLaterItems[0].title).toBe("File taxes");
    });
});

describe("Displayable List Test Suite", () => {
    test("Should format overdue items correctly", () => {
        const displayableList = toDisplayableList(overdue());
        expect(displayableList).toBe(`[ ] Pay rent ${formatDate(yesterday)}`);
    });

    test("Should format due today items correctly", () => {
        const displayableList = toDisplayableList(dueToday());
        expect(displayableList).toBe("[ ] Service vehicle");
    });

    test("Should format due later items correctly", () => {
        const displayableList = toDisplayableList(dueLater());
        expect(displayableList).toBe(`[ ] File taxes ${formatDate(tomorrow)}`);
    });

    test("Should format completed items with [x]", () => {
        markAsComplete(0);
        const displayableList = toDisplayableList([todo[0]]);
        expect(displayableList).toContain("[x]");
    });
});