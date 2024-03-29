const todoController = require("../controllers/todo.controller");
const userMiddleware = require("../middleware/tokenVerify.middleware");
const todoMiddleware = require("../middleware/todo.validation");
const uploadImageMiddleware = require("../middleware/uploadImage.middleware");
const express = require("express");
const router = express.Router();

router.get("/gettodo", userMiddleware.userProfile, todoController.getTodo);

router.post(
  "/addtodo",
  [userMiddleware.userProfile, todoMiddleware.todoMiddleware],
  todoController.addTodo
);
router.put(
    "/updatetodo",userMiddleware.userProfile,uploadImageMiddleware.uploadImage,todoController.updateTodo
);

router.delete(
  "/deletetodo",
  userMiddleware.userProfile,
  todoController.deleteTodo
);

module.exports = router;
 