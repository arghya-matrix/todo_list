const multer = require("multer");
const db = require("../models/index");
const path = require("path");
const { Op } = require("sequelize");
const fs = require('fs');

const imageStorage = multer.diskStorage({
  destination: "./upload",
  filename: (req, file, cb) => {
    return cb(
      null,
      `${req.userdata.user_name}_${file.fieldname}_${Date.now()}${path.extname(
        file.originalname
      )}`);
  },
});

const upload = multer({
  storage: imageStorage,
  limits: { fileSize: 1000000000000 },
}).single("Eventimages");


async function uploadImage(req, res, next) { 
  upload(req, res, async function (err) {

    if (err) {
      // console.log(req.body, "<-----Body Data");
      console.log(err, "<------Error HAndling the file");
      return res.status(400).json({ error: "File upload failed" });
    }

    const todo = await db.Todo.findAll({
      where: {
        [Op.and]: [
          { user_id: req.userdata.user_id }, 
          { todo_id: req.body.todo_id },
        ],
      },
      raw: true,
    });

    const type = todo[0].todo_type;

    if (req.body.status == "Done" && type == "Event") {
      req.url = `http://localhost:3300/upload/${req.file.filename}`;
      next();
    } else if(req.file) {
      fs.unlinkSync(req.file.path);
      next();
    }
    else{ 
    next();
    }
  });
}
module.exports = {
  uploadImage,
};
