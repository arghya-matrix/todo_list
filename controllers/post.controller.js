const postServices = require('../services/post.services');
const db = require('../models/index');
const { URL } = require('url');
const path = require('path');
const fs = require('fs');
const { Op } = require('sequelize');


async function getPublishedPost(req, res) {
    const page = req.query.page ? req.query.page : 1;
    const itemsInPage = req.query.size;

    const orderOptions = [];

    const size = itemsInPage ? +itemsInPage : 3;
    const index = page ? (page - 1) * size : 0;
    if (req.query.dateOrder) {
        const dateOrder = req.query.dateOrder;
        orderOptions.push(["createdAt", dateOrder])
    }
    if (req.query.nameOrder) {
        const nameOrder = req.query.nameOrder;
        orderOptions.push(["post_title", nameOrder]);
    }
    else {
        orderOptions.push(["post_title", "ASC"]);
    }

    const post = await postServices.getPublishPost({
        index: index,
        pageSize: size,
        orderOptions: orderOptions
    });

    const currentPage = page ? +page : 1;
    const totalPages = Math.round((post.count + 1) / size)
    res.json({
        "Total Pages": totalPages,
        "Total Items": post.count,
        "Current Page": currentPage,
        message: `Published post`,
        data: post.rows
    })
}

async function getMyPrivatePosts(req, res) {
    const page = req.query.page ? req.query.page : 1;
    const itemsInPage = req.query.size;

    const size = itemsInPage ? +itemsInPage : 3;
    const index = page ? (page - 1) * size : 0;
    const orderOptions = [];
    const whereObject = {};

    if (req.query.dateOrder) {
        const dateOrder = req.query.dateOrder;
        orderOptions.push(["createdAt", dateOrder])
    }
    if (req.query.nameOrder) {
        const nameOrder = req.query.nameOrder;
        orderOptions.push(["post_title", nameOrder]);
    }
    else {
        orderOptions.push(["post_title", "ASC"]);
    }

    // Find todo by date and status and type
    if (req.query.date) {
        const parsedDate = moment(req.query.date).format("YYYY-MM-DD");
        // const date = new Date(parsedDate);

        whereObject.createdAt = parsedDate
    }

    // Date Range Filter
    if (req.query.startDate && req.query.endDate) {
        const startDate = moment(req.query.startDate).format("YYYY-MM-DD");
        const endDate = moment(req.query.endDate).format("YYYY-MM-DD");

        whereObject.createdAt = {
            [Op.between]: [startDate, endDate],
        };
    }

    if (req.query.publish == 'true') {
        whereObject.publish = {
            [Op.eq]: true
        }
    }

    if (req.query.publish == 'false') {
        whereObject.publish = {
            [Op.eq]: false
        }
    }

    if (req.query.post_title) {
        whereObject.post_title = req.query.post_title
    }

    whereObject.user_id = req.userdata.user_id

    const post = await postServices.getMyPosts({
        index: index,
        pageSize: size,
        orderOptions: orderOptions,
        whereObject: whereObject
    })
    const currentPage = page ? +page : 1;
    const totalPages = Math.ceil((post.count + 1) / size)
    res.json({
        totalItems: post.count,
        currentPage: currentPage,
        totalPages: totalPages,
        "Private Posts": post.rows,
    })
}

async function createPost(req, res) {
    try {
        if (!req.body.title) {
            return res.status(400).json({ error: "Title is missing in the request" });
        }
        const post = await postServices.createPost({
            description: req.body.description,
            imagePath: req.url,
            title: req.body.title,
            user_id: req.userdata.user_id
        })
        res.json({
            data: post
        })
    } catch (error) {
        console.log(error, " <---- an error occured");
    }
}

async function publish(req, res) {
    try {
        const post = await postServices.publish({
            post_id: req.query.post_id,
            user_id: req.userdata.user_id
        })
        res.json({
            data: post
        })
    } catch (error) {
        console.log(error, " <---- an error occured");
    }

}

async function private(req, res) {
    try {
        const post = await postServices.private({
            post_id: req.query.post_id,
            user_id: req.userdata.user_id
        })
        if (post.numUpdatedRows > 0) {
            res.json({
                data: post.post
            })
        }
        else if (post.numUpdatedRows == 0 || post.numUpdatedRows == undefined) {
            res.json({
                message: `${req.query.post_id} not found or already private`,
            })
        }
    } catch (error) {
        console.log(error, " <---- an error occured");
    }
}

// async function updateTitle(req, res) {
//     try {
//         const post = await postServices.updateTitle({
//             newTitle: req.body.newTitle,
//             oldTitle: req.query.oldTitle,
//             user_id: req.userdata.user_id
//         })
//         res.json({
//             data: post
//         })
//     } catch (error) {
//         console.log(error, " <---- an error occured");
//     }
// }

// async function updateDescription(req, res) {
//     try {
//         const post = await postServices.updateDescription({
//             description: req.body.description,
//             title: req.query.title,
//             user_id: req.userdata.user_id
//         })
//         res.json({
//             data: post
//         })
//     } catch (error) {
//         console.log(error, " <---- an error occured");
//     }
// }

async function updatePost(req, res) {
    // console.log(req.file,"file data");
    // console.log(req.query.post_id, " <<---post id");
    const updateOptions = {}
    const whereOptions = {}
    whereOptions.post_id = req.query.post_id;
    // console.log(whereOptions,"<<----where options");

    if (req.file) {
        const data = await db.Post.findOne({
            where: {
                post_title: req.query.post_id,
                user_id: req.userdata.user_id
            },
            raw: true
        })

        if (data) {
            const imageUrl = data.images;
            const parsedUrl = new URL(imageUrl);


            const imageName = path.basename(parsedUrl.pathname);
            const imagePath = path.join(__dirname, '..', 'upload', 'postImage', imageName);
            // console.log(imagePath, "<<--------Path image");

            fs.unlink(imagePath, (err) => {
                if (err) throw err;
            })
        }
        updateOptions.images = req.url
        // console.log(req.url,"<----Url data");
    }

    if (req.query.title) {
        updateOptions.title = req.query.title
    }
    if (req.query.description) {
        updateOptions.description = req.query.description
    }

    const post = await postServices.updatePost({
        updateOptions: updateOptions,
        whereOptions: whereOptions
    })
    if (post.numUpdatedRows > 0) {
        res.json({
            data: post.post
        })
    } else {
        res.json({
            message: `Data Not Found`
        })
    }
}

async function deletePost(req, res) {

    try {
        if (!req.body.title) {
            return res.status(400).json({ error: "Title is missing in the request" });
        }
        await postServices.deletePost({
            title: req.query.title,
            user_id: req.userdata.user_id
        })
        res.json({
            data: `${req.query.title} Post is deleted.`
        })
    } catch (error) {
        console.log(error, " <---- an error occured");
    }
}

module.exports = {
    getPublishedPost,
    createPost,
    publish,
    private,
    updatePost,
    deletePost,
    getMyPrivatePosts
}