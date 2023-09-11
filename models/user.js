const {DataTypes, UUIDV1} = require('sequelize');
const sequelize = require('../db/database');

const User = sequelize.define(
    'Users',{
        user_id:{
            type: DataTypes.INTEGER,
            autoIncrement:true,
            allowNull:false,
            unique: true,
            primaryKey:true
        },
        uuid:{
            type: DataTypes.UUID,
            defaultValue:UUIDV1,
        },
        Name:{
            type:DataTypes.STRING,
            allowNull:false
        },
        user_name:{
            type:DataTypes.STRING,
            allowNull:false
        },
        email_address:{
            type: DataTypes.STRING,
            allowNull: false
        }, 
        password :{
            type:DataTypes.STRING,
            allowNull:false
        }
    },{
        timestamps:false,
        id:false
    }
)

module.exports = User;