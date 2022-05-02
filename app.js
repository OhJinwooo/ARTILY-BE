const express = require("express");
const app = express();
const port = 3000;
require("dotenv").config();

const kakaoRouter = require("./kakao-auth/kakao/kakao");
const passportKakao = require("./kakao-auth");
// const naverRouter = require("./naver-auth/naver/naver");
// const passportNaver = require("./naver-auth/login");
const passport = require("passport");
const { swaggerUi, specs } = require("./swagger/swagger");

const connect = require("./schemas/index.schemas");
const postRouter = require("./routes/post.router");
const userRouter = require("./routes/user.router");

const cors = require("cors");

// passportNaver();
passportKakao();
connect();

app.use(cors());
app.use(express.json());
app.use("/oauth", [kakaoRouter]);
app.use("/api", [postRouter, userRouter]);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use(passport.initialize());
app.use(passport.session());

https: app.listen(port, () => {
  console.log(port, "서버가 연결되었습니다.");
});
