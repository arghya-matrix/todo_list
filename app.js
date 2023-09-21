const express = require('express');
const server = express();
const path = require('path');
const port = 3300;
// const todoServices = require('./services/todo.services');

const userRouter = require('./routes/user.route');
const todoRouter = require('./routes/todo.route');
const uploadImage = require('./middleware/uploadImage.middleware');
const postImage = require('./middleware/postImageMiddleware');
const postRouter = require('./routes/post.route');

server.use((req, res, next) => {
    console.log(req.method, req.ip, req.path);
    next();
});
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.use("/upload", express.static(path.join(__dirname, 'upload')));
server.use("/post_image", express.static(path.join(__dirname, 'upload/postImage')));
server.use("/user", userRouter);
server.use("/user/post", postRouter, postImage.postImage)
server.use("/todo", todoRouter, uploadImage.uploadImage);


server.listen(port, () => {
    console.log(`server started at ${port}`);
})