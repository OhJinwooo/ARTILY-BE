// // //multer-s3 미들웨어 연결
// //require("dotenv").config();
// //const authMiddleware = require("./middlewares/auth-middleware");
// require("dotenv").config();
// const s3 = require("../config/s3");

// let multer = require("multer");
// let multerS3 = require("multer-s3");
// let path = require("path");

// let upload = multer({
//   storage: multerS3({
//     s3: s3,
//     bucket: process.env.BUCKETNAME,
//     key: function (req, file, cb) {
//       //The name of the file
//       let extension = path.extname(file.originalname);
//       cb(null, Date.now().toString() + extension);
//     },
//     acl: "public-read-write",
//     //acl : Access control for the file
//   }),
// });

// module.exports = upload;
require("dotenv").config();
const multer = require("multer");
const multerS3 = require("multer-s3");
const s3 = require("../config/s3");
const upload = multer({
  storage: multerS3({
    s3: s3,
    // 버킷 이름
    bucket: process.env.BUCKETNAME,
    acl: "public-read-write",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      //파일 이름 설정
      cb(
        null,
        Math.floor(Math.random() * 1000).toString() +
          Date.now() +
          "." +
          file.originalname.split(".").pop()
      );
    },
  }),
  //사이즈 제한
  limits: { fileSize: 1000 * 1000 * 10 },
});
module.exports = upload;
