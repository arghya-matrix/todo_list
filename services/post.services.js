const { Op } = require('sequelize');
const db = require('../models/index');


async function getPublishPost({ pageSize, index, orderOptions }) {
    const post = await db.Post.findAndCountAll({
        where: {
            publish: {
                [Op.eq]: true
            }
        }, order: orderOptions,
        limit: pageSize,
        offset: index
    })
    return post;
}

async function getMyPosts({ whereObject, pageSize, index, orderOptions }) {
    const post = await db.Post.findAndCountAll({
        where: whereObject,
        order: orderOptions,
        limit: pageSize,
        offset: index
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

async function publish({ user_id, post_id }) {

    await db.Post.update({ publish: true }, {
        where: {
            user_id: user_id,
            post_id: post_id
        }
    })
    const post = await db.Post.findAll({
        where: {
            user_id: user_id,
            post_id: post_id
        },
        raw: true
    })
    return post;
}

async function private({ user_id, post_id }) {
    const [numUpdatedRows, updatedRows] = await db.Post.update({ publish: false }, {
        where: {
            [Op.and]: [{ post_id: post_id },
            { user_id: user_id },
            { publish: { [Op.ne]: false } }]
        },
    })

    const post = await db.Post.findAll({
        where: {
            post_id: post_id,
            user_id: user_id
        },
        raw: true
    })
    return { numUpdatedRows, post };
}
/////////////////////////////////////////////////update//////////////////////////////////////////////////////////

async function updatePost({ updateOptions, whereOptions }) {
    const [numUpdatedRows,updatedRows]= await db.Post.update(updateOptions, {
        where: whereOptions
    })
    console.log(whereOptions, " Where Clause passed from controller");
    const post = await db.Post.findAll({
        where: whereOptions,
        raw: true
    })
    // console.log(numUpdatedRows,post, " <<<----return values")
    return {numUpdatedRows,post};
}

// async function updateImage({ user_id, url, post_id }) {
//     await db.Post.update({ images: url }, {
//         where: {
//             user_id: user_id,
//             post_id: post_id
//         }
//     })
//     const post = await db.Post.findAll({
//         where: {
//             post_id: post_id,
//             user_id: user_id
//         },
//         raw: true
//     })
//     return  post;
// }

// async function updateDescription({ user_id, title, description }) {
//     await db.Post.update({ description: description }, {
//         where: {
//             user_id: user_id,
//             post_title: title
//         }
//     })
//     const post = await db.Post.findAll({
//         where: {
//             user_id: user_id,
//             post_title: title
//         },
//         raw: true
//     })
//     return post
// }

async function deletePost({ user_id, title }) {
    const post = await db.Post.destroy({
        where: {
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
    updatePost,
    getPublishPost,
    validatePost,
    deletePost,
    getMyPosts
}