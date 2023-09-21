const { DataTypes } = require("sequelize");
const sequelize = require("../db/database");

const Post = sequelize.define('Post',{
    post_id: {
        type : DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
        unique: true
    },
    user_id:{
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    post_title : {
        type : DataTypes.STRING,
        allowNull: true
    },
    description : {
        type: DataTypes.STRING,
        allowNull: false
    },
    publish:{
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
    },
    images:{
        type: DataTypes.STRING,
        allowNull:true
    },
    updatedAt: DataTypes.DATEONLY,
    createdAt:DataTypes.DATEONLY
},{
    id: false
})

module.exports = Post;