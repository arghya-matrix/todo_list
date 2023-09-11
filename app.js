const express = require('express');
const server = express();
const port = 3300;
const todoServices = require('./services/todo.services');
const userRouter = require('./routes/user.route');
const todoRouter = require('./routes/todo.route');


server.use((req,res,next)=>{
    console.log(req.method,req.ip,req.path);
    next();
});
server.use(express.json());
server.use("/user",userRouter);
server.use("/todo",todoRouter);

server.listen(port,()=>{
    console.log(`server started at ${port}`);
})