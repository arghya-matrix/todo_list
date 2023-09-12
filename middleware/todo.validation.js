const todoServices = require("../services/todo.services");
const moment = require('moment')

async function todoMiddleware(req, res, next) {
  const data = req.userdata;
  const body = req.body;
  const parsedDate = moment(body.todo_date).format("YYYY-MM-DD");
  const date = new Date(parsedDate);
  const todo = await todoServices.todoValidation({
    date: date,
    title: body.title,
    user_id: data.user_id,
  });
  if(todo.count>0){
    res.json({
        message : `todo already existed`,
        data: todo.rows
    })
    return;
  }
  next();
}

module.exports = {
    todoMiddleware
}
