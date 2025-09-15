const express = require("express");
var csrf = require("tiny-csrf");
var cookieParser = require("cookie-parser");
const app = express();
const { Todo, User } = require("./models");
const bodyParser = require("body-parser");
const path = require("path");

const passport = require("passport");
const connectEnsureLogin = require("connect-ensure-login");
const session = require("express-session");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const saltRounds = 10;
const flash = require("connect-flash");

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser("ssh! some secret string"));
app.use(csrf("this_should_be_32_character_long", ["POST", "PUT", "DELETE"]));
app.use(express.static(path.join(__dirname, "public")));
app.use(flash());

app.use(session({
  secret: "my-super-secret-key-12345",
  cookie: { maxAge: 24 * 60 * 60 * 1000 }, // 1 day
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(function(request, response, next) {
    response.locals.messages = request.flash();
    next();
});

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");


passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
}, (username, password, done) => {
  User.findOne({ where: { email: username } })
  .then(async function (user) {
    const result = await bcrypt.compare(password, user.password);
    if (result) {
      return done(null, user);
    } else {
      return done(null, false, { message: "Invalid password" });
    }
  })
  .catch((error) => {
    return done(error);
  });
}));

passport.serializeUser((user, done) => {
  console.log("Serializing user:", user.id);
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findByPk(id)
  .then(user => {
    done(null, user);
  })
  .catch(error => {
    done(error, null);
  });
});

app.get("/", async (request, response) => {
  if(request.isAuthenticated()) {
    return response.redirect("/todos");
  }
  response.render("index", {
    title: "Todo Application",
    csrfToken: request.csrfToken(),
  });
});

app.get("/todos", connectEnsureLogin.ensureLoggedIn(), async (request, response) => {
  const loggedInUser = request.user.id;
    const overdue = await Todo.overdue(loggedInUser);
    const dueToday = await Todo.dueToday(loggedInUser);
    const dueLater = await Todo.dueLater(loggedInUser);
    const completed = await Todo.findAll({ where: { completed: true } });
  if (request.accepts("html")) {
    return response.render("todos", {
      title: "Todo Application",
      overdue,
      dueToday,
      dueLater,
      completed,
      csrfToken: request.csrfToken(),
    });
  } else {
    return response.json({ overdue, dueToday, dueLater, completed });
  }
});

app.get("/signup", (request, response) => {
  response.render("signup", { title: "Signup", csrfToken: request.csrfToken() })
});

app.post("/users", async (request, response) => {
  const { firstName, email, password } = request.body;
  if (!firstName || !email || !password) {
    request.flash("error", "First name and email are required");
    return response.redirect("/signup");
  }
  try {
    const hashedPwd =  await bcrypt.hash(request.body.password, saltRounds);
    console.log(hashedPwd);
    const user = await User.create({
     firstName: request.body.firstName,
     lastName: request.body.lastName,
     email: request.body.email,
     password: hashedPwd,
    })
    request.login(user, (err) => {
      if (err) {
        console.log(err);
        return response.status(500).send("Something went wrong!"); 
      }
       return response.redirect("/todos");
      });
  } catch (error) {
      if (error.name === "SequelizeValidationError") {
        request.flash("error", error.errors.map((e) => e.message));
        return response.redirect("/signup");
      }
      console.log(error);
      return response.status(500).send("Something went wrong!");
  } 
})

app.get("/login", (request, response) => {
  response.render("login", { title: "Login", csrfToken: request.csrfToken() });
})

app.get("/signout", (request, response, next) => {
  request.logout((err) => {
    if (err) {
      return next(err); 
    }
    response.redirect("/");
  });
});

app.post("/todos",connectEnsureLogin.ensureLoggedIn(), async function (request, response) {
  if (!request.body.title || !request.body.dueDate) {
    return response.status(400).json({ error: "Title and due date are required" });
  }
  console.log("Creating a todo", request.body);
  console.log(request.user);
  try {
    await Todo.addTodo({
      title: request.body.title,
      dueDate: request.body.dueDate,
      userId: request.user.id,
    });
    return response.redirect("/todos");
  } catch (error) {
    console.error(error);
    return response.status(422).json(error);
  }
});

app.post(
  "/session",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  function (request, response) {
    console.log(request.user);
    response.redirect("/todos");
  }
);

app.put("/todos/:id/markAsCompleted",connectEnsureLogin.ensureLoggedIn(), async (request, response) => {
  const todo = await Todo.findByPk(request.params.id);
  try {
    const updatedTodo = await todo.setCompletionStatus(request.body.completed);
    return response.json(updatedTodo);
  } catch (error) {
    console.error(error);
    return response.status(422).json(error);
  }
});

app.delete("/todos/:id", connectEnsureLogin.ensureLoggedIn(), async (request, response) => {
  console.log("We have to delete a Todo with ID: ", request.params.id);
  try {
    await Todo.remove(request.params.id, request.user.id);
    return response.json({ success: true });
  } catch (error) {
    console.error(error);
    return response.status(422).json(error);
  }
});

module.exports = app;
