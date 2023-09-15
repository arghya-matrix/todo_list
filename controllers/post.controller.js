const postServices = require('../services/post.services');
const db = require('../models/index');
const { URL } = require('url');
const path = require('path');
const fs = require('fs');

async function getPublishedPost(req, res) {
    const page = req.query.page;
    const itemsInPage = req.query.size;
    
    const orderOptions = [];

    const size = itemsInPage ? +itemsInPage : 3;
    const index = page ? page * size : 0;
    if(req.query.dateOrder){
        const dateOrder = req.query.dateOrder;
        orderOptions.push(["createdAt",dateOrder])
    }
    if(req.query.nameOrder){
        const nameOrder = req.query.nameOrder;
        orderOptions.push(["post_title",nameOrder]);
    }

    const post = await postServices.getPublishPost({
        index:index,
        pageSize: size,
        orderOptions:orderOptions
    });

    const currentPage = page ? +page : 0;
    const totalPages = Math.round((post.count+1)/size)
    res.json({
        "Total Pages" : totalPages,
        "Total Items" : post.count,
        "Current Page" : currentPage,
        message: `Published post`,
        data: post.rows
    })
}

async function getMyPrivatePosts(req,res){
    const page = req.query.page;
    const itemsInPage = req.query.size;

    const size = itemsInPage ? +itemsInPage : 3;
    const index = page ? page * size : 0
    const post = await postServices.getMyPrivatePosts({
        index: index,
        pageSize: size,
        user_id: req.userdata.user_id
    })
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil((post.count+1)/size)
    res.json({
        totalItems : post.count,
        currentPage: currentPage,
        totalPages : totalPages,
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
            title: req.query.title,
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
            title: req.query.title,
            user_id: req.userdata.user_id
        })
        if (post.numUpdatedRows > 0) {
            res.json({
                data: post.post
            })
        }
        else if(post.numUpdatedRows == 0 || post.numUpdatedRows == undefined){
            res.json({
                message: `${req.query.title} not found or already private`,
            })
        }
    } catch (error) {
        console.log(error, " <---- an error occured");
    }
}

async function updateTitle(req, res) {
    try {
        const post = await postServices.updateTitle({
            newTitle: req.body.newTitle,
            oldTitle: req.query.oldTitle,
            user_id: req.userdata.user_id
        })
        res.json({
            data: post
        })
    } catch (error) {
        console.log(error, " <---- an error occured");
    }
}

async function updateDescription(req, res) {
    try {
        const post = await postServices.updateDescription({
            description: req.body.description,
            title: req.query.title,
            user_id: req.userdata.user_id
        })
        res.json({
            data: post
        })
    } catch (error) {
        console.log(error, " <---- an error occured");
    }
}

async function updatePhoto(req, res) {
    const data = await db.Post.findOne({
        where: {
            post_title: req.query.title,
            user_id: req.userdata.user_id
        },
        raw: true
    })

    if (data) {
        const imageUrl = data.images;
        const parsedUrl = new URL(imageUrl);
        
       
        const imageName = path.basename(parsedUrl.pathname);
        const imagePath = path.join(__dirname, '..', 'upload', 'postImage', imageName);
        console.log(imagePath,"<<--------Path image");

        fs.unlink(imagePath, (err) => {
            if (err) throw err; 
        })
    }
    try {
        const post = await postServices.updateImage({
            title: req.query.title,
            url: req.url,
            user_id: req.userdata.user_id
        })
        res.json({
            data: post
        })
    } catch (error) {
        console.log(error, " <---- an error occured");
    }
}

async function deletePost(req,res){
    
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
    updateTitle,
    updateDescription,
    updatePhoto,
    deletePost,
    getMyPrivatePosts
}