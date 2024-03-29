const { Op, where } = require("sequelize");
const db = require("../models/index");


async function todoValidation({ user_id, title, date }) {
  const todo = await db.Todo.findAndCountAll({
    where: {
      [Op.and]: [
        { user_id: user_id },
        { title: title },
        { todo_date: { [Op.eq]: date } },
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

async function getTodoByFilter(whereObject) {
  const todo = await db.Todo.findAll({
    where: whereObject,
    raw: true,
    order: [[ "title","ASC"]],
  });
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

// async function updateTodoType({ user_id, title, type }) {
//   await db.Todo.update(
//     { todo_date: type },
//     {
//       where: {
//         [Op.and]: [{ title: title }, { user_id: user_id }],
//       },
//     }
//   );
//   const todo = await db.Todo.findAll({
//     where: {
//       [Op.and]: [{ title: title }, { user_id: user_id }],
//     },
//   });
//   return todo;
// }

async function updateTodo({ updateOptions, whereOptions }) {
  await db.Todo.update(updateOptions,
    {
      where: whereOptions
    }
  );
  const todo = await db.Todo.findAll({
    where: whereOptions
  });
  return todo;
}

// async function updateTodoDate({ user_id, title, date }) {
//   await db.Todo.update(
//     { todo_date: date },
//     {
//       where: {
//         [Op.and]: [{ title: title }, { user_id: user_id }],
//       },
//     }
//   );
//   const todo = await db.Todo.findAll({
//     where: {
//       [Op.and]: [{ title: title }, { user_id: user_id }],
//     },
//   });
//   return todo;
// }

// async function updateStatus({ user_id, title, status }) {
//   await db.Todo.update(
//     { todo_status: status },
//     {
//       where: {
//         [Op.and]: [{ title: title }, { user_id: user_id }],
//       },
//     }
//   );
//   const todo = await db.Todo.findAll({
//     where: {
//       [Op.and]: [{ title: title }, { user_id: user_id }],
//     },
//     raw: true,
//   });
//   if (status == "Done") {
//     const log = await db.Log.create({
//       log_details: todo[0].todo_status,
//       todo_id: todo[0].todo_id,
//     });
    
//   }
//   return todo;
// }

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
  deleteTodo,
  updateTodo,
  checkExpiry,
  changeExpiry,
  todoValidation,
  getTodoByFilter,
};
