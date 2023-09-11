const {DataTypes} = require('sequelize');
const sequelize = require('../db/database');

const Log = sequelize.define('Log',{
    log_id: {
        type : DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
        unique: true
    },
    todo_id:{
        type: DataTypes.INTEGER,
        allowNull:false
    },
    log_details:{
        type: DataTypes.STRING,
        allowNull: false
    }
},{
    updatedAt:false,
    id:false
})

module.exports = Log;