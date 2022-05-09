const express = require("express");
const http = require("http");
const https = require("https");
const app = express();
const port = 3000;
const server = http.createServer(app);
const socket = require("socket.io");
const passport = require("passport");
require("dotenv").config();

/* const option = {
  key:
  cert:
}; */

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

app.use(passport.initialize());
app.use(passport.session());
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
]);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

io.on("connection", (socket) => {
  const users = [];
  for (let [id, socket] of io.of("/").sockets) {
    users.push({
      userID: id,
      username: socket.username,
    });
  }
  socket.emit("users", users);
  // ...
});

https: server.listen(port, () => {
  console.log(port, "서버가 연결되었습니다.");
});
/* https.createServer(option, app).listen(port, () => {
  console.log('https'+port+'server start')
}) */
