const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
    host: 'localhost',
    port: 3306,
    database: 'todo_list',
    dialect: 'mysql',
    username: 'root',
    password: 'Matrix@2023',
    logging: false
});

sequelize.authenticate().then(() => {
    console.log("Database connected");
}).catch(err => {
    console.log("Error database: -> ", err);
});

module.exports = sequelize;