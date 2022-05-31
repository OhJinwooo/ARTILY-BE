require("dotenv").config();
const express = require("express");
const app = express();
const httpPort = process.env.PORT;

const kakaoRouter = require("./kakao-auth/kakao/kakao");
const passportKakao = require("./kakao-auth");
const naverRouter = require("./naver-auth/naver/naver");
const passportNaver = require("./naver-auth/login");
const { swaggerUi, specs } = require("./swagger/swagger");
const connect = require("./schemas/index.schemas");
const postRouter = require("./routes/post.router");
const userRouter = require("./routes/user.router");
const reviewRouter = require("./routes/review.router");
const mypageRouter = require("./routes/mypage.router");
const likeRouter = require("./routes/like.router");
const blackListRouter = require("./routes/blackList.router");
const followRouter = require("./routes/follow.router");
const chatRouter = require("./routes/chat.router");
const cors = require("cors");
//접속로그 남기기
const requestMiddleware = (req, res, next) => {
  console.log(
    "ip:",
    req.ip,
    "domain:",
    req.rawHeaders[1],
    "method:",
    req.method,
    "Request URL:",
    req.originalUrl,
    "-",
    new Date()
  );
  next();
};

passportNaver();
passportKakao();
connect();

app.use(cors());
app.use(express.json());
app.use(requestMiddleware);
app.use("/oauth", [kakaoRouter, naverRouter]);
app.use("/api", [
  userRouter,
  reviewRouter,
  mypageRouter,
  likeRouter,
  blackListRouter,
  postRouter,
  followRouter,
  chatRouter,
]);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.get("/", (req, res) => {
  return res.send("good");
});

app.listen(httpPort, () => {
  console.log("http " + httpPort + " server startttttttt");
});
