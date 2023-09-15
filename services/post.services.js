const { Op } = require('sequelize');
const db = require('../models/index');


async function getPublishPost({pageSize,index, orderOptions}) {
    const post = await db.Post.findAndCountAll({
        where: {
            publish: {
                [Op.eq]: true
            }
        },order: orderOptions,
        limit: pageSize,
        offset: index
    })
    return post;
}

async function getMyPrivatePosts({user_id, pageSize, index }){
    const post = await db.Post.findAndCountAll({
        where:{
            user_id:user_id,
            publish: {
                [Op.eq]: false
            }
        },
        limit: pageSize,
        offset : index
    })
    return post;
}

async function validatePost({ user_id, title }) {
    const post = await db.Post.findAndCountAll({
        where: {
            user_id: user_id,
            post_title: title
        }
    })
    return post
}

async function createPost({ user_id, imagePath, title, description }) {
    const post = await db.Post.create({
        user_id: user_id,
        post_title: title,
        description: description,
        images: imagePath
    })
    return post;
}

async function publish({ user_id, title }) {
   
    await db.Post.update({ publish: true }, {
        where: {
            user_id: user_id,
            post_title: title
        }
    })
    const post = await db.Post.findAll({
        where: {
            user_id: user_id,
            post_title: title
        },
        raw: true
    })
    return post;
}

async function private({ user_id, title }) {
    const [ numUpdatedRows, updatedRows ] = await db.Post.update({ publish: false }, {
        where: {
            [Op.and]: [{ post_title: title },
            { user_id: user_id },
            { publish: { [Op.ne]: false } }]
        },
        
    })
    // console.log( numUpdatedRows, updatedRows );
    const post = await db.Post.findAll({
        where:{
            post_title : title,
            user_id: user_id
        },raw: true
    })
    return  {numUpdatedRows, post} ;
}
/////////////////////////////////////////////////update////////////////////////////////////////////////////////////
async function updateTitle({ user_id, newTitle, oldTitle }) {
    await db.Post.update({ post_title: newTitle }, {
        where: {
            user_id: user_id,
            post_title: oldTitle
        }
    })
    const post = await db.Post.findAll({
        where: {
            user_id: user_id,
            post_title: newTitle
        },
        raw: true
    })
    return post
}

async function updateImage({ user_id, url, title }) {
    await db.Post.update({ images: url }, {
        where: {
            user_id: user_id,
            post_title: title
        }
    })
}

async function updateDescription({ user_id, title, description }) {
    await db.Post.update({ description: description }, {
        where: {
            user_id: user_id,
            post_title: title
        }
    })
    const post = await db.Post.findAll({
        where: {
            user_id: user_id,
            post_title: title
        },
        raw: true
    })
    return post
}

async function deletePost({user_id, title}){
    const post = await db.Post.destroy({
        where:{
            user_id: user_id,
            post_title: title
        }
    })
        return post;
}

module.exports = {
    createPost,
    publish,
    private,
    updateTitle,
    updateDescription,
    getPublishPost,
    validatePost,
    updateImage,
    deletePost,
    getMyPrivatePosts
}