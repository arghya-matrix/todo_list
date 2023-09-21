const express = require('express')
const router = express.Router()
const userMiddleware = require('../middleware/tokenVerify.middleware')

const postImageMiddleware = require('../middleware/postImageMiddleware')
const postController = require('../controllers/post.controller');
const postMiddleware = require('../middleware/post.middleware')

router.get("/getmyposts",[userMiddleware.userProfile],postController.getMyPrivatePosts);
router.get('/getall', postController.getPublishedPost);
// router.get("/getpost",postController.getPost)
router.post('/create', [userMiddleware.userProfile, postImageMiddleware.postImage, postMiddleware.validatePost], postController.createPost);

router.post('/publish', [userMiddleware.userProfile], postController.publish)
router.post('/private', [userMiddleware.userProfile], postController.private)
router.put("/updatepost",[userMiddleware.userProfile, postImageMiddleware.postImage], postController.updatePost);


module.exports = router
 