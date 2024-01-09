const express = require("express");
const app = express();
const { Todo } = require("./models");
const bodyParser = require("body-parser");
const path = require("path");
app.use(bodyParser.json());
app.set("view engine","ejs");
app.get("/", async (request, response) =>{
  const allTodos = await Todo.getTodos();
  if( request.accepts("html")) {
    response.render("index",{
      allTodos
    });
  }else{
    response.json({
      allTodos
    })
  }
  
});
app.use(express.static(path.join(__dirname,'public')));
app.get("/todos", async function (_request, response) {
  try {
    const todos = await Todo.findAll(); // Retrieve all Todos from the database
    return response.json(todos); // Respond with all Todos
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
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

app.post("/todos", async function (request, response) {
  try {
    const todo = await Todo.addTodo(request.body);
    return response.json(todo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.put("/todos/:id/markAsCompleted", async function (request, response) {
  const todo = await Todo.findByPk(request.params.id);
  try {
    const updatedTodo = await todo.markAsCompleted();
    return response.json(updatedTodo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.delete("/todos/:id", async function (request, response) {
  try {
    const deletedTodoCount = await Todo.destroy({
      where: { id: request.params.id }, // Specify the Todo to delete by ID
    });

    // Respond based on whether the Todo was deleted or not
    if (deletedTodoCount > 0) {
      return response.send(true); // Todo was deleted
    } else {
      return response.send(false); // Todo with the given ID was not found
    }
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});


module.exports = app;
