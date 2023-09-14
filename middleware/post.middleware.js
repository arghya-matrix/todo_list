const postServices= require('../services/post.services');
const fs = require('fs');
const path = require('path');

// const express = require('express');
// const app =express();
// app.use(express.urlencoded({ extended: true }));


async function validatePost(req, res, next) {
   

    if (!req.body.title) {
        return res.status(400).json({ error: "Title is missing in the request" });
    }

    const post = await postServices.validatePost({
        title: req.body.title,
        user_id: req.userdata.user_id,
    });
    
    if (post.count > 0) {
        const imagePath =path.join(__dirname,'..' ,'upload','postImage', req.file.filename);
        console.log(imagePath);
        fs.unlink(imagePath,(err)=>{
            if(err) throw err;
        })
        return res.json({
            message: `Post already exists`,
            data: post.rows,
        });
    } else {
        next();
    }
}

module.exports = {
    validatePost
}