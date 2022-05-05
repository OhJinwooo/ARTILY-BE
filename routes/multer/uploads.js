//multer-s3 미들웨어 연결
//require("dotenv").config();
//const authMiddleware = require("./middlewares/auth-middleware");
const s3 = require("../config/s3");

let multer = require("multer");
let multerS3 = require("multer-s3");
let path = require("path");

let upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "hyewonblog",
    key: function (req, file, cb) {
      //The name of the file
      let extension = path.extname(file.originalname);
      cb(null, Date.now().toString() + extension);
    },
    acl: "public-read-write",
    //acl : Access control for the file
  }),
});

//exports.upload = upload; //upload 인식못하는 에러남
module.exports = upload;
//module.exports = s3;
//exports.s3 = s3;
