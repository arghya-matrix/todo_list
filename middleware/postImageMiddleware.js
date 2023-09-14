const multer = require("multer");
const path = require("path");


const imageStorage = multer.diskStorage({
    destination: "./upload/postImage",
    filename: (req, file, cb) => {
        return cb(
            null,
            `${req.userdata.user_name}_${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
        ); },
});

const upload = multer({
    storage: imageStorage,
    limits: { fileSize: 100000000 },
}).single("image");



async function postImage(req, res, next) {


    upload(req, res, async function (err) {
     
        if (err) {
            console.log(err, "<------Error HAndling the file");
            return res.status(400).json({ error: "File upload failed" });
        }
        // console.log(req.file);
        req.url = `http://localhost:3300/post_image/${req.file.filename}`;
        req.path = req.file.path
        console.log(req.path);
        next();
    }); 
}
module.exports = { 
    postImage,
};
