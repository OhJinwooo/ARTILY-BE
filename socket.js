// require("dotenv").config();
// const express = require("express");
// const http = require("http");
// const https = require("https");
// const app = express();
// const cors = require("cors");
// const server = http.createServer(app);
// const socket = require("socket.io");
// const { Server } = requier("socket.io");
// const { createAdapter } = require("@socket.io/redis-adapter");
// const { Cluster } = require("ioredis");

// const io = new Server();

// const redis = new Cluster([
//   {
//     host: "localhost",
//     port: 6380,
//   },
//   {
//     host: "localhost",
//     port: 6381,
//   },
// ]);

// const subClient = redis.duplicate();

// io.adapter(redisAdapter(redis, subClient));

// server.listen(process.env.PORT, () => {
//   console.log(`Server running on Port ${process.env.PORT}`);
// });

// io.on("connection", (socket) => {
//   socket.on("login", (user) => {
//     const userId = user.userId;
//     const nickname = user.nickname;
//     const id = socket.id;
//     if (userId) redis.hset(`currentOn`, userId, nickname, id);
//   });

//   socket.on("request", async (data) => {
//     //  data.userId 는 클라이언트에서 보내준 타겟의 userId
//     const targetId = data.userId;
//     redis.hget(`currentOn`, targetId, async (error, id) => {
//       if (id) await io.socket.to(id).emit("requested", true);
//     });

//     socket.on("join_room", (roomName, targetUser, post) => {
//       socket.join(roomName);
//       console.log(socket.id, socket.nickname);
//       const { userId, nickname, profileImage } = socket;
//       // 유저 조회해서 상대방 프로필이미지, 닉네임 찾기
//       const target = sessionStore.findSession(targetUser);
//       console.log("타겟:", target);
//       const receive = {
//         post,
//         roomName,
//         target: userId,
//         nickname,
//         profileImage: profileImage,
//         messages: [],
//         newMessage: 0,
//         lastMessage: null,
//         lastTime: null,
//       };
//     });
//     socket.on("send_message", (messageData) => {
//       const receive = {
//         roomName: messageData.roomName,
//         from: false,
//         message: messageData.message,
//         time: messageData.time,
//       };
//       socket.to(messageData.roomName).emit("receive_message", receive);
//     });
//   });
// });

// const kakaoRouter = require("./kakao-auth/kakao/kakao");
// const passportKakao = require("./kakao-auth");
// const naverRouter = require("./naver-auth/naver/naver");
// const passportNaver = require("./naver-auth/login");
// const { swaggerUi, specs } = require("./swagger/swagger");

// const connect = require("./schemas/index.schemas");

// const postRouter = require("./routes/post.router");
// const userRouter = require("./routes/user.router");
// const reviewRouter = require("./routes/review.router");
// const mypageRouter = require("./routes/mypage.router");
// const likeRouter = require("./routes/like.router");
// const blackListRouter = require("./routes/blackList.router");
// const followRouter = require("./routes/follow.router");

// //접속로그 남기기
// const requestMiddleware = (req, res, next) => {
//   console.log(
//     "ip:",
//     req.ip,
//     "domain:",
//     req.rawHeaders[1],
//     "method:",
//     req.method,
//     "Request URL:",
//     req.originalUrl,
//     "-",
//     new Date()
//   );
//   next();
// };

// passportNaver();
// passportKakao();
// connect();

// app.use(cors());
// app.use(express.json());
// app.use(requestMiddleware);
// app.use("/oauth", [kakaoRouter, naverRouter]);
// app.use("/api", [
//   userRouter,
//   reviewRouter,
//   mypageRouter,
//   likeRouter,
//   blackListRouter,
//   postRouter,
//   followRouter,
// ]);

// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// /* https.createServer(option, app).listen(port, () => {
//   console.log('https'+port+'server start')
// }) */

// // const io = socket(server, {
// //   cors: {
// //     origin: process.env.CORSPORT,
// //     credentials: true,
// //   },
// // });

// // io.on("connection", (socket) => {
// //   const users = [];
// //   for (let [id, socket] of io.of("/").sockets) {
// //     users.push({
// //       userID: id,
// //       username: socket.username,
// //     });
// //   }
// //   socket.emit("users", users);
// //   // ...
// // });
