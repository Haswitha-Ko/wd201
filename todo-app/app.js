const express = require("express");
var csrf = require("tiny-csrf");
const app = express();
const { Todo } = require("./models");
var cookieparser = require("cookie-parser");
const bodyParser = require("body-parser");
const path = require("path");
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieparser("shh! some secret string"));
app.use(csrf("this_should_be_32_character_long",["POST", "PUT", "DELETE"]));
app.set("view engine","ejs");
app.get("/", async (request, response) =>{
  const allTodos = await Todo.getTodos();
  const Overdue = await Todo.overdue();
  const DueToday = await Todo.dueToday();
  const DueLater = await Todo.dueLater();
  const Completed = await Todo.completed();
  if( request.accepts("html")) {
    response.render("index",{
      allTodos,
      Overdue,
      DueToday,
      DueLater,
      Completed,
      csrfToken: request.csrfToken(),
    });
  }else{
    response.json({
      allTodos,
      Overdue,
      DueToday,
      DueLater,
      Completed
    })
  }
});
app.use(express.static(path.join(__dirname,'public')));
app.get("/todos", async function (_request, response) {
  const allTodos = await Todo.getTodos();
  const Overdue = await Todo.overdue();
  const DueToday = await Todo.dueToday();
  const DueLater = await Todo.dueLater();
  const Completed = await Todo.completed();
  if( request.accepts("html")) {
    response.render("index", {
      allTodos,
      Overdue,
      DueToday,
      DueLater,
      Completed,
      csrfToken: request.csrfToken(),
    });
  } else {
    response.json({
      allTodos,
      Overdue,
      DueToday,
      DueLater,
      Completed
    })
  }
});

app.get("/todos/:id", async function (request, response) {
  try {
    const todo = await Todo.findByPk(request.params.id);
    return response.json(todo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.post("/todos", async (request, response)) {
  try {
    await Todo.addTodo({
      title: request.body.title,
      dueDate: request.body.dueDate,
    });
    return response.redirect("/");
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.put("/todos/:id/", async (request, response)=> {
  const todo = await Todo.findByPk(request.params.id);
  try {
    const updatedTodo = await todo.setCompletionStatus(request.body.completed);
    return response.json(updatedTodo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.delete("/todos/:id", async function (request, response) {
  console.log("We have to delete a Todo with ID: ", request.params.id);
  try {
    await Todo.remove(request.params.id);
    return response.json({ success: true });
  } catch (error) {
    return response.status(422).json(error);
  }
  /*try {
    const deletedTodoCount = await Todo.destroy({
      where: { id: request.params.id }, // Specify the Todo to delete by ID
    });*/

    // Respond based on whether the Todo was deleted or not
    
});


module.exports = app;
