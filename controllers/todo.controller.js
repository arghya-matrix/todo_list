const todoServices = require("../services/todo.services");
const moment = require("moment");
require("./expiry.controller");
// const logServices = require("../services/log.services");

async function addTodo(req, res) {
  const data = req.userdata;
  const body = req.body;
  // const date = moment(body.todo_date, "YYYY-MM-DD").startOf('day').toDate();
  const parsedDate  = moment(body.todo_date).format("YYYY-MM-DD")
  const date = new Date(parsedDate);
  console.log(date);
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
  else{
    res.json({
      message : "Cannot add todo list in past"
    })
  }
}

async function getTodo(req, res) {
  const data = req.userdata;
  // const date = moment(req.query.date, "YYYY-MM-DD").toDate();

  const parsedDate  = moment(req.query.date).format("YYYY-MM-DD");
  const date = new Date(parsedDate);
  const parsedStartDate = moment(req.query.startDate).format("YYYY-MM-DD");
  const startDate = new Date(parsedStartDate);

  const parsedEndDate = moment(req.query.endDate).format("YYYY-MM-DD");
  const endDate = new Date(parsedEndDate);
  const type = req.query.type;
  const status = req.query.status;

  if (!data) {
    res.status(404).json({
      message: `login first`,
    });
  }

  if (data && !type && !status && !startDate && !endDate && date) {
    const todo = await todoServices.getTodo({
      user_id: data.user_id,
    });

    // const todoIds = todo.map((todo) => todo.todo_id);
    // const status = todo.map((todo) => todo.todo_status);

    // console.log(todoIds);
    //     const logUpdate = await logServices.updateLog({
    //         todo_id: todoIds,
    //         status:status
    //     })

    res.json({
      message: `Your all todo list -----`,
      data: todo,
    });
  }

  // Find todo by date and status and type
  if (data && type && status && date){
    const todo = await todoServices.getTodoByStatusTypeDate({
      date:date,
      status: status,
      type: type
    })
    res.json({
      message: `Your filtered todo list -----`,
      data: todo,
    });
  }

// Find todo by date and status
  if(data && date && status && !type){
   const todo = await todoServices.getTodoByDateStatus({
    todo_date: date,
    todo_status: status,
    user_id: data.user_id
   })
   res.json({
    message : `Your filtered data according to date & status`,
    data: todo
   })
  }

// Find todo by date and type
  if (data && date && type && !status){
    const todo = await todoServices.getTodoByTypeDate({
      todo_date:date,
      todo_type : type,
      user_id: data.user_id
    })
    res.json({
      message: `Your filtered data according to ${date} and ${type}`,
      data: todo
    })
  }

  // Find todo by status and type
  if(data && type && status && !date){
    const todo = await todoServices.getTodoByTypeStatus({
      todo_status : status,
      todo_type : type,
      user_id: data.user_id
    })
    res.json({
      message: `Your filtered data according to ${type} and ${status}`,
      data : todo
    })
  }

// Find todo by datefilter
  if(data && !type && !status && startDate && endDate){
    const todo = await todoServices.dateRangeFilter({
      user_id: data.user_id,
      endDate: endDate,
      startDate: startDate
    })
    res.json({
      message : `Your date ranged filtered data`,
      data: todo
    })
  }

// Find todo by type
  if (data && type && !status && !date) {
    const todo = await todoServices.getTodoByType({
      type: type,
      user_id: data.user_id,
    });
    res.json({
      message: `Your ${type} todo list -----`,
      data: todo,
    });
  }

// Find todo by status
  if (data && status && !type && !date) {
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

async function updateTodo(req, res) 
{
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
  } 
  else if (date < currentDate) {
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
