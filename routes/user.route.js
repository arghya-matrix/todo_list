const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const verifyMiddleware = require('../middleware/tokenVerify.middleware');
const userMiddleware = require('../middleware/user-validation');

router.get("/getuser",userController.getUser);
router.post("/signup",userMiddleware.validationUser,userController.signUp);
router.post("/signin",userController.signIn);

router.post("/logout",verifyMiddleware.userProfile,userController.logOut);
router.get("/profile",verifyMiddleware.userProfile,userController.userProfile);
router.delete("/delete",verifyMiddleware.userProfile,userController.deleteUser);

module.exports = router;