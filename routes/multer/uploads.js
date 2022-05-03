//multer-s3 미들웨어 연결
//require("dotenv").config();
//const authMiddleware = require("./middlewares/auth-middleware");

let multer = require("multer");
let multerS3 = require("multer-s3");
let AWS = require("aws-sdk");
const path = require("path");
AWS.config.loadFromPath(path.join(__dirname, "../config/s3.json")); // 인증
let s3 = new AWS.S3();
let upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "mandublog",
    key: function (req, file, cb) {
      //The name of the file
      let extension = path.extname(file.originalname);
      cb(null, Date.now().toString() + extension);
    },
    acl: "public-read-write",
    //acl : Access control for the file
  }),
});

module.exports = upload;
