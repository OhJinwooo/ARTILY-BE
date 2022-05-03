const express = require("express");
const http = require("http");
const app = express();
const port = 3000;
const server = http.createServer(app);
const socket = require("socket.io");
require("dotenv").config();

const kakaoRouter = require("./kakao-auth/kakao/kakao");
const passportKakao = require("./kakao-auth");
const naverRouter = require("./naver-auth/naver/naver");
const passportNaver = require("./naver-auth/login");
// const passport = require("passport");
const { swaggerUi, specs } = require("./swagger/swagger");

const connect = require("./schemas/index.schemas");

const postRouter = require("./routes/post.router");
const userRouter = require("./routes/user.router");
const reviewRouter = require("./routes/review.router");
const testRouter = require("./routes/post.router");
const mypageRouter = require("./routes/mypage.router");

const cors = require("cors");

passportNaver();
passportKakao();
connect();

app.use(cors());
app.use(express.json());
app.use("/oauth", [kakaoRouter, naverRouter]);
app.use("/api", [postRouter, userRouter, reviewRouter, mypageRouter]);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});
// global.onlineUsers = new Map();
io.on("connection", (socket) => {
  console.log("연결 connect: ", socket.id);
  // console.log("globalChatSocket: ", global.chatSocket);
  socket.on("disconnect", () => {
    console.log("디스커넥트 disconnect: ", socket.id);
  });
  socket.on("join_room", (data) => {
    socket.join(data);
    console.log("join_room 방들어감: ", data);
    console.log(socket.rooms);
  });
  socket.on("send_message", (data) => {
    console.log("send: ", data);
    socket.to(data.roomName).emit("receive_message", data);
  });
});

https: server.listen(port, () => {
  console.log(port, "서버가 연결되었습니다.");
});
