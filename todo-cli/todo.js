const todo = [];

function add(todoItem) {
    if (!todoItem.title || !todoItem.dueDate) {
        throw new Error("Todo item must have title and dueDate");
    }
    todo.push({
        title: todoItem.title,
        dueDate: new Date(todoItem.dueDate).toISOString().split("T")[0], // Ensure consistent date format
        completed: todoItem.completed || false // Default to false if not provided
    });
}

function markAsComplete(index) {
    if (index < 0 || index >= todo.length) {
        throw new Error("Invalid index");
    }
    todo[index].completed = true;
}

function getToday() {
    return new Date().toISOString().split("T")[0];
}

function overdue() {
    const today = getToday();
    return todo.filter(
        (item) => !item.completed && item.dueDate < today
    );
}

function dueToday() {
    return todo.filter((item) => item.dueDate === getToday());
}

function dueLater() {
    const today = getToday();
    return todo.filter(
        (item) => !item.completed && item.dueDate > today
    );
}

function toDisplayableList(list) {
    const today = getToday();
    return list
        .map((item) => {
            const checkbox = item.completed ? "[x]" : "[ ]";
            const displayDate = item.dueDate !== today ? ` ${item.dueDate}` : "";
            return `${checkbox} ${item.title}${displayDate}`;
        })
        .join("\n");
}

module.exports = {
    todo,
    add,
    markAsComplete,
    overdue,
    dueToday,
    dueLater,
    toDisplayableList,
};