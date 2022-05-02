const express = require("express");
const app = express();
const port = 3000;

const kakaoRouter = require("./kakao-auth/kakao/kakao");
const passportKakao = require("./kakao-auth");
const naverRouter = require("./naver-auth/naver/naver");
const passportNaver = require("./naver-auth/login");
const passport = require("passport");
const { swaggerUi, specs } = require("./swagger/swagger");

const connect = require("./schemas/index.schemas");

const postRouter = require("./routes/post.router");
const userRouter = require("./routes/user.router");
const reviewRouter = require("./routes/review.router");

const cors = require("cors");

passportNaver();
passportKakao();
connect();

app.use(cors());
app.use(express.json());
app.use("/oauth", [kakaoRouter, naverRouter]);
app.use("/api", [postRouter, userRouter, reviewRouter]);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

let multer = require("multer");
let multerS3 = require("multer-s3");
let AWS = require("aws-sdk");
let s3 = new AWS.S3();
const path = require("path");
AWS.config.loadFromPath(path.join(__dirname, "./routes/config/s3.json")); // 인증

// app.use(passport.initialize());
// app.use(passport.session());

https: app.listen(port, () => {
  console.log(port, "서버가 연결되었습니다.");
});
