const todoController = require('../controllers/todo.controller');
const todoMiddleware = require('../middleware/tokenVerify.middleware');
const express = require('express');
const router = express.Router();

router.get("/gettodo",todoMiddleware.userProfile,todoController.getTodo);

router.post("/addtodo", todoMiddleware.userProfile,todoController.addTodo);
router.put("/updatetodo",todoMiddleware.userProfile,todoController.updateTodo);

router.delete("/deletetodo", todoMiddleware.userProfile,todoController.deleteTodo);

module.exports = router;