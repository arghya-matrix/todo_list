const todoServices = require("../services/todo.services");
const { Op, where } = require('sequelize')
const moment = require("moment");
const expiryController = require("./expiry.controller");
expiryController.dateExpiry();
// const logServices = require("../services/log.services");

async function addTodo(req, res) {
  const data = req.userdata;
  const body = req.body;
  // const date = moment(body.todo_date, "YYYY-MM-DD").startOf('day').toDate();
  const date = moment(body.todo_date).format("YYYY-MM-DD");
  // const date = new Date(parsedDate);
  console.log(date);
  const dateInstacne = new Date();
  const dateJson = dateInstacne.toJSON();
  const currentDate = dateJson.slice(0, 10)

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
  else {
    res.json({
      message: "Cannot add todo list in past",
    });
  }
}

async function getTodo(req, res) {
  const data = req.userdata;
  const whereObject = {};
  whereObject.user_id = data.user_id;

  // Find todo by date and status and type
  if (req.query.date) {
    const parsedDate = moment(req.query.date).format("YYYY-MM-DD");
    // const date = new Date(parsedDate);
    
    whereObject.todo_date = parsedDate
  }

  // Date Range Filter
  if (req.query.startDate && req.query.endDate) {
    const startDate = moment(req.query.startDate).format("YYYY-MM-DD");

    const endDate = moment(req.query.endDate).format("YYYY-MM-DD");
       
    whereObject.todo_date = {
      [Op.between]: [startDate, endDate],
    };
  }

  //Find todo by date and status
  if (req.query.status) {
    const status = req.query.status;

    whereObject.todo_status = status
  }

  // Find todo by date & type
  if (req.query.type) {

    whereObject.todo_type = req.query.type
  }

  const todo = await todoServices.getTodoByFilter(whereObject);
  res.json({
    message: `your filtered data`,
    data: todo
  })
}

  async function updateTodo(req, res) {
    const data = req.userdata;
    const body = req.body;
    const type = body.type;
    const status = body.status;
    const updateTitle = body.title;
    const date = moment(req.body.date, "DD-MM-YYYY").toDate();

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
      if(req.url){
        res.json({
          message: todo,
          "Event Images" : `${req.url}`
        });
      }
      else{
        res.json({
          message: todo,
        });
      }
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
