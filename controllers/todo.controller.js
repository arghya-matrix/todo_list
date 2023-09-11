const todoServices = require("../services/todo.services");
const moment = require("moment");
require("./expiry.controller");
const logServices = require('../services/log.services')

async function addTodo(req, res) {
  const data = req.userdata;
  const body = req.body;
  const date = moment(body.todo_date, "DD-MM-YYYY").toDate();
  // console.log(date);
  const currentDate = new Date();

  if (date > currentDate) {
    const todo = await todoServices.addTodo({
      title: body.title,
      todo_date: date,
      todo_status: body.todo_status,
      todo_type: body.todo_type,
      user_id: data.user_id,
    });
    res.json({
      message: `${body.title} added to ${data.user_name} `,
      data: todo,
    });
  }
}

async function getTodo(req, res) {
  const data = req.userdata;
  console.log(data);
  const type = req.body.todo_type;
  const status = req.body.status;

  if (!data) {
    res.status(404).json({
      message: `login first`,
    });
  }

  if (data && !type && !status) {
    const todo = await todoServices.getTodo({
      user_id: data.user_id,
    });

    const todoIds = todo.map((todo) => todo.todo_id);
    const status = todo.map((todo) => todo.todo_status);

    console.log(todoIds);
        const logUpdate = await logServices.updateLog({
            todo_id: todoIds[i],
            status:status
        })

    res.json({
      message: `Your todo list -----`,
      data: todo,
    });
  }
  if (data && type) {
    const todo = await todoServices.getTodoByType({
      type: type,
      user_id: data.user_id,
    });
    res.json({
      message: `Your ${type} todo list -----`,
      data: todo,
    });
  }

  if (data && status) {
    const todo = await todoServices.getTodoByStats({
      status: status,
      user_id: data.user_id,
    });
    res.json({
      message: `your ${status} todo list ------`,
      data: todo,
    });
  }
}

async function updateTodo(req, res) {
  const data = req.userdata;
  const body = req.body;
  const type = body.type;
  const status = body.status;
  const updateTitle = body.title;
  const date = moment(req.body.todo_date, "DD-MM-YYYY").toDate();

  const currentDate = new Date();

  if (data && type) {
    const todo = await todoServices.updateTodoType({
      title: body.title,
      type: type,
      user_id: data.user_id,
    });
    res.json({
      message: `${body.title} todo type updated to ${body.type}`,
      updated_todo: todo,
    });
  }

  if (data && status) {
    const todo = await todoServices.updateStatus({
      status: status,
      title: body.title,
      user_id: data.user_id,
    });
    res.json({
      message: todo,
    });
  }
  // console.log(date);

  if (data && date && date > currentDate) {
    const todo = await todoServices.updateTodoDate({
      date: date,
      title: body.title,
      user_id: data.user_id,
    });
    res.json({
      message: todo,
    });
  } else if (date < currentDate) {
    res.json({
      message: `Cannot add time in past`,
    });
  }

  if (data && updateTitle && !type && !date && !status) {
    const todo = await todoServices.updateTodoTitle({
      newTitle: body.new_title,
      oldTitle: body.old_title,
      user_id: data.user_id,
    });
    res.json({
      message: todo,
    });
  }
}

async function deleteTodo(req, res) {
  const data = req.userdata;
  const title = req.body.title;
  const todo = await todoServices.deleteTodo({
    title: title,
    user_id: data.user_id,
  });
  res.json({
    message: todo,
  });
}

module.exports = {
  addTodo,
  getTodo,
  updateTodo,
  deleteTodo,
};
