const todo = [];

function add(todoItem) {
    todo.push(todoItem);
}

function markAsComplete(index) {
    todo[index].completed = true;
}

function overdue() {
    return todo.filter(
        (item) =>
            !item.completed &&
            new Date(item.dueDate) < new Date(new Date().toISOString().split("T")[0])
    );
}

function dueToday() {
    return todo.filter(
        (item) =>
            item.dueDate === new Date().toISOString().split("T")[0]
    );
}

function dueLater() {
    return todo.filter(
        (item) =>
            !item.completed &&
            new Date(item.dueDate) > new Date(new Date().toISOString().split("T")[0])
    );
}

function toDisplayableList(list) {
    return list
        .map((item) => {
            const checkbox = item.completed ? "[x]" : "[ ]";
            const displayDate =
                item.dueDate !== new Date().toISOString().split("T")[0]
                    ? " " + item.dueDate
                    : "";
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