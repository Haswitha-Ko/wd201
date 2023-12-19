"use strict";
const { Model, Op } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    static async addTask(params) {
      return Todo.create(params);
    }

    static async showList() {
      console.log("My Todo list \n");

      console.log("Overdue");
      const todo_over_due = await Todo.overdue();
      const formatted_Over_due = todo_over_due
        .map((todo) => todo.displayableString())
        .join("\n")
        .trim();
      console.log(formatted_Over_due);
      console.log("\n");

      console.log("Due Today");
      const todo_due_Today = await Todo.dueToday();
      const formatted_Due_Today = todo_due_Today
        .map((todo) => todo.displayableString())
        .join("\n")
        .trim();
      console.log(formatted_Due_Today);
      console.log("\n");

      console.log("Due Later");
      const todo_due_Later = await Todo.dueLater();
      const formatted_Due_Later = todo_due_Later
        .map((todo) => todo.displayableString())
        .join("\n")
        .trim();
      console.log(formatted_Due_Later);
    }

    static async overdue() {
      const todo_over_due = await Todo.findAll({
        where: {
          dueDate: { [Op.lt]: new Date() },
        },
      });

      return todo_over_due;
    }

    static async dueToday() {
      const todo_due_Today = await Todo.findAll({
        where: {
          dueDate: { [Op.eq]: new Date() },
        },
      });

      return todo_due_Today;
    }

    static async dueLater() {
      const todo_due_Later = await Todo.findAll({
        where: {
          dueDate: { [Op.gt]: new Date() },
        },
      });

      return todo_due_Later;
    }

    static async markAsComplete(id) {
      await Todo.update(
        {
          completed: true,
        },
        {
          // eslint-disable-next-line object-shorthand
          where: { id: id },
        }
      );
    }

    displayableString() {
      const checkbox = this.completed ? "[x]" : "[ ]";
      let due_Date_String="";

      const today = new Date(this.today);
      today.setHours(0, 0, 0, 0);

      const dueDate = new Date(this.dueDate);
      dueDate.setHours(0, 0, 0, 0);

      if (this.completed || dueDate > today) {
        due_Date_String = dueDate.toISOString().slice(0, 10);
      }

      return `${this.id}. ${checkbox} ${this.title} ${due_Date_String}`;
    }
    
    static associate(models) {
    }
  }
  Todo.init(
    {
      title: DataTypes.STRING,
      dueDate: DataTypes.DATEONLY,
      completed: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Todo",
    }
  );
  return Todo;
};
