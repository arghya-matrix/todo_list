const { Op } = require('sequelize');
const db = require('../models/index');
const { v4: uuidv4 } = require('uuid');

async function getPublishPost(){
    const post = await db.Post.findAll({
        where : {
            publish: {
                [Op.ne] :null
            }
        },
        raw: true
    })
    return post;
}

async function validatePost({user_id, title}){
    const post = await db.Post.findAndCountAll({
        where : {
            user_id:user_id,
            post_title: title
        }
    })
    return post
}

async function createPost({user_id,imagePath,title, description}){
    const post = await db.Post.create({
        user_id: user_id,
        post_title : title,
        description:description,
        images: imagePath
    })
    return post;
}

async function publish({user_id,title}){
    const uuid = uuidv4();
    await db.Post.update({publish:uuid},{
        where:{
            user_id:user_id,
            post_title:title
        }
    })
    const post = await db.Post.findAll({
        where: {
            user_id:user_id,
            post_title: title
        },
        raw:true
    })
    return post;
}

async function private({user_id, title}){
    const [numUpdatedRows, updatedRows] = await db.Post.update({publish:null},{
        where:{
            post_title:title,
            user_id:user_id
        }
    })
    return (numUpdatedRows);
}
/////////////////////////////////////////////////update////////////////////////////////////////////////////////////
async function updateTitle({user_id, newTitle, oldTitle}){
    await db.Post.update({post_title:newTitle},{
        where: {
            user_id:user_id,
            post_title: oldTitle
        }
    })
    const post = await db.Post.findAll({
        where:{
            user_id:user_id,
            post_title:newTitle
        },
        raw:true
    })
    return post
}

async function updateImage({user_id, url, title}){
    await db.Post.update({images: url},{
        where: {
            user_id: user_id,
            post_title: title
        }
    })
}

async function updateDescription({user_id, title, description}){
    await db.Post.update({description: description},{
        where: {
            user_id:user_id,
            post_title: title
        }
    })
    const post = await db.Post.findAll({
        where:{
            user_id:user_id,
            post_title:title
        },
        raw:true
    })
    return post
}

module.exports = {
    createPost,
    publish,
    private,
    updateTitle,
    updateDescription,
    getPublishPost,
    validatePost,
    updateImage
}