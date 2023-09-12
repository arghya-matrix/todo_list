const { Op, where } = require("sequelize");
const db = require("../models/index");

async function todoValidation({ user_id, title, date }) {
  const todo = await db.Todo.findAndCountAll({
    where: {
      [Op.and]: [
        { user_id: user_id },
        { title: title },
        {
          todo_date: {
            [Op.eq]: date,
          },
        },
      ],
    },
  });
  // console.log(todo.count,todo.rows);
  return todo;
}

async function addTodo({ user_id, title, todo_type, todo_status, todo_date }) {
  const data = await db.Todo.create({
    user_id: user_id,
    title: title,
    todo_type: todo_type,
    todo_status: todo_status,
    todo_date: todo_date,
  });
  const todo = { ...data.get(), user_id: undefined };
  return todo;
}

async function getTodo({ user_id }) {
  const todo = await db.Todo.findAll({
    where: {
      user_id: user_id,
    },
    raw: true,
  });
  // console.log(todo);

  return todo;
}

async function getTodoByType({ user_id, type }) {
  const todo = await db.Todo.findAll({
    where: {
      [Op.and]: [{ todo_type: type }, { user_id: user_id }],
    },
    raw: true,
  });
  return todo;
}

async function dateRangeFilter({ startDate, endDate, user_id }) {
  console.log(startDate, endDate);
  const todo = await db.Todo.findAll({
    where: {
      [Op.and]: [
        {
          todo_date: { [Op.gte]: startDate, [Op.lte]: endDate },
        },
        {user_id : user_id,}
      ],
    },
  });

  return todo;
}

async function getTodoByDateStatus({ todo_date, user_id, todo_status}){
  const todo = await db.Todo.findAll({
    where : {
      todo_date: todo_date,
      user_id : user_id,
      todo_status : todo_status
    }
  })
  return todo;
}

async function getTodoByTypeDate({ todo_date, user_id, todo_type }){
  const todo = await db.Todo.findAll({
    where :{
      todo_date: todo_date,
      user_id : user_id,
      todo_type : todo_type
    }
  })
  return todo;
}

async function getTodoByTypeStatus({ todo_type, todo_status, user_id }){
  const todo = await db.Todo.findAll({
    where : {
      todo_type : todo_type,
      todo_status : todo_status,
      user_id: user_id
    }
  })
  return todo;
}

async function getTodoByStatusTypeDate({ type, status, date }) {
  console.log(type, status, date);
  const todo = await db.Todo.findAll({
    where: {
      [Op.and]: [
        { todo_type: type },
        { todo_status: status },
        { todo_date: { [Op.eq]: date } }, // Compare dates for equality
      ],
    },
  });
  // console.log(todo);
  return todo;
}

async function getTodoByStats({ user_id, status }) {
  const todo = await db.Todo.findAll({
    where: {
      [Op.and]: [{ todo_status: status }, { user_id: user_id }],
    },
    raw: true,
  });
  console.log(todo);

  return todo;
}

async function deleteTodo({ user_id, title }) {
  await db.Todo.destroy({
    where: {
      [Op.and]: [{ title: title }, { user_id: user_id }],
    },
  });
  return `${title} todo deleted`;
}

async function updateTodoType({ user_id, title, type }) {
  await db.Todo.update(
    { todo_date: type },
    {
      where: {
        [Op.and]: [{ title: title }, { user_id: user_id }],
      },
    }
  );
  const todo = await db.Todo.findAll({
    where: {
      [Op.and]: [{ title: title }, { user_id: user_id }],
    },
  });
  return todo;
}

async function updateTodoTitle({ user_id, newTitle, oldTitle }) {
  await db.Todo.update(
    { title: newTitle },
    {
      where: {
        [Op.and]: [{ title: oldTitle }, { user_id: user_id }],
      },
    }
  );
  const todo = await db.Todo.findAll({
    where: {
      [Op.and]: [{ title: newTitle }, { user_id: user_id }],
    },
  });
  return todo;
}

async function updateTodoDate({ user_id, title, date }) {
  await db.Todo.update(
    { todo_date: date },
    {
      where: {
        [Op.and]: [{ title: title }, { user_id: user_id }],
      },
    }
  );
  const todo = await db.Todo.findAll({
    where: {
      [Op.and]: [{ title: title }, { user_id: user_id }],
    },
  });
  return todo;
}

async function updateStatus({ user_id, title, status }) {
  await db.Todo.update(
    { todo_status: status },
    {
      where: {
        [Op.and]: [{ title: title }, { user_id: user_id }],
      },
    }
  );
  const todo = await db.Todo.findAll({
    where: {
      [Op.and]: [{ title: title }, { user_id: user_id }],
    },
    raw: true,
  });
  if (status == "Done") {
    const log = await db.Log.create({
      log_details: todo[0].todo_status,
      todo_id: todo[0].todo_id,
    });
  }
  return todo;
}

async function checkExpiry({ date }) {
  const status = "Not done";

  const expiredTodos = await db.Todo.findAll({
    where: {
      [Op.and]: [
        {
          todo_date: {
            [Op.lt]: date,
          },
        },
        {
          todo_status: {
            [Op.eq]: status,
          },
        },
      ],
    },
    raw: true,
  });
  await db.Todo.update(
    { todo_status: `Expired` },
    {
      where: {
        todo_id: expiredTodos.map((todo) => todo.todo_id),
      },
    }
  );
}

async function changeExpiry({ date }) {
  const updatedDateTodos = await db.Todo.findAll({
    where: {
      [Op.and]: [
        {
          todo_date: {
            [Op.gte]: date,
          },
        },
        {
          todo_status: {
            [Op.eq]: "Expired",
          },
        },
      ],
    },
    raw: true,
  });
  await db.Todo.update(
    { todo_status: `Not done` },
    {
      where: {
        todo_id: updatedDateTodos.map((todo) => todo.todo_id),
      },
    }
  );
}

module.exports = {
  addTodo,
  getTodo,
  getTodoByType,
  deleteTodo,
  updateTodoType,
  updateTodoDate,
  updateTodoTitle,
  getTodoByStats,
  updateStatus,
  checkExpiry,
  changeExpiry,
  getTodoByStatusTypeDate,
  dateRangeFilter,
  todoValidation,
  getTodoByDateStatus,
  getTodoByTypeDate,
  getTodoByTypeStatus
};
