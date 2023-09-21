const { DataTypes } = require("sequelize");
const sequelize = require("../db/database");

const Todo = sequelize.define(
    "Todo_lists",{
        todo_id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement:true,
            unique:true,
            allowNull:false
        },
        user_id:{
            type: DataTypes.INTEGER,
            allowNull:false,
        },
        title:{
            type: DataTypes.STRING,
            allowNull:false
        },
        todo_type:{
            type:DataTypes.STRING,
            allowNull:false
        },
        todo_status:{
            type:DataTypes.STRING,
            allowNull:false,
            defaultValue: `Not done`
        },
        todo_date:{
            type:DataTypes.DATEONLY,
            allowNull:false
        },
        event_images : {
            type:DataTypes.STRING,
            allowNull: true
        }
    },{
        updatedAt:false,
        id:false
    }
);


module.exports = Todo;