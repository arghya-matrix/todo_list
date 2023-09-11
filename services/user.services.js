const { Op } = require('sequelize');
const db = require('../models/index');
const blockedToken = [];

async function getUser({user_id}){
    const user = db.User.findAll({
        where:{
            user_id:user_id
        },
        raw:true
    })
    return user;
}

async function addUser ({Name, user_name,email_address, password}){
    const user = await db.User.create({
        Name:Name,
        user_name:user_name,
        password:password,
        email_address:email_address
    },{
        returning: true,
        attributes: {
            exclude: ['password','user_id']
        }
    })
    const userData = {...user.get(),password: undefined, user_id : undefined}
    return userData;
}

async function validateUser({email_address}){
    const user = await db.User.findAll({
        where:{
            email_address:email_address
        },
        raw: true
    })
    const count = user.length
    return count;
}

async function deleteUser({email_address}){
    await db.User.destroy({
        where:{
            email_address:email_address
        }
    })
    return (`${email_address} has been removed`);
}

async function updateUser({Name, email_address}){
    await db.User.update({Name:Name},
        {
            where:{
                email_address:email_address
            }
        })
        const user = await db.User.findOne({
            where:{
                email_address:email_address
            },
            raw:true
        })
        const userData = {...user.get(),password: undefined, user_id : undefined}
        return userData;
}

async function signIn ({
     email_address
}){
    const data = await db.User.findAll({
        where:{
            email_address: email_address
        },
        raw:true,
        })
    
    return data;
};

async function logOut({
    jwt
}){
    blockedToken.push(jwt);
    return blockedToken;
}

module.exports= {
    addUser,
    validateUser,
    deleteUser,
    updateUser,
    getUser,
    signIn,
    logOut,
    blockedToken
}