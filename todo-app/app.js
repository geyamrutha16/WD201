const express = require("express");
const app = express();
const path = require("path");
const { Todo } = require("./models");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", async (req, res) => {
    const todos = await Todo.findAll({ order: [["id", "ASC"]] });
    res.render("index", { todos });
});
