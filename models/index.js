const sequelize = require('../db/database');
const User = require('./user')
const Todo =require('./todo-list');
const Log = require('./log');

User.hasMany(Todo,{
    foreignKey: "user_id",
    onUpdate: "CASCADE",
    onDelete: "CASCADE"
})
Todo.belongsTo(User,{
    foreignKey: "user_id"
})

Todo.hasMany(Log,{
    foreignKey: "todo_id",
    onUpdate: "CASCADE",
    onDelete: "CASCADE"
})
Log.belongsTo(Todo,{
    foreignKey: "todo_id"
})

sequelize.sync({force: false});



module.exports = {
    sequelize,
    Todo,
    User,
    Log
} 