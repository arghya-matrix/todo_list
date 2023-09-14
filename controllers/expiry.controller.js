const todoServices = require("../services/todo.services");

// console.log(currentDate);

const dateExpiry = (currentDate) => {
  todoServices.checkExpiry({
    date: currentDate,

  }, todoServices.changeExpiry({
    date: currentDate,
  }))
}

module.exports = { dateExpiry };
