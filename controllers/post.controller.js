const postServices = require('../services/post.services');

async function getPublishedPost(req,res){
    const post = await postServices.getPublishPost();

    res.json({
        message: `Published post`,
        data : post 
    })
}

async function createPost(req,res){
    try {
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
        console.log(error," <---- an error occured");
    }
}

async function publish(req,res){
    try {
        const post = await postServices.publish({
            title: req.body.title,
            user_id: req.userdata.user_id
        })
        res.json({
            data: post
        })
    } catch (error) {
        console.log(error," <---- an error occured");
    }
    
}

async function private(req,res){
    const post = await postServices.private({
        title:req.body.title,
        user_id: req.userdata.user_id
    })
}