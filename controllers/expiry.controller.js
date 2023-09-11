const currentDate = new Date();
const todoServices = require("../services/todo.services");

// console.log(currentDate);

const dateExpiry = (
  todoServices.checkExpiry({
    date: currentDate,
    
  }, todoServices.changeExpiry({
    date: currentDate,
  })))

module.exports = dateExpiry;
