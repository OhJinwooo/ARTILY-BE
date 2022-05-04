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
const { swaggerUi, specs } = require("./swagger/swagger");

const connect = require("./schemas/index.schemas");

const postRouter = require("./routes/post.router");
const userRouter = require("./routes/user.router");
const reviewRouter = require("./routes/review.router");
const mypageRouter = require("./routes/mypage.router");
const Chat = require("./schemas/chat.schemas");

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
const chat = io.of("/chat");
io.on("connection", (socket) => {
  console.log("연결 connect: ", socket.id);
  // console.log("globalChatSocket: ", global.chatSocket);
  socket.on("disconnect", () => {
    console.log("디스커넥트 disconnect: ", socket.id);
    Chat.find(function (err, result) {
      const arr = [];
      if (result.length !== 0) {
        for (var i = result.length - 1; i >= 0; i--) {
          arr.push({
            from: result[i].from,
            message: result[i].message,
            createdAt: result[i].createdAt,
            profileImg: result[i].profileImg,
          });
        }
        chat.to(socket.id).emit("receive message", arr.reverse());
      }
    });
  });
  socket.on("join_room", (data) => {
    socket.join(data);

    console.log("join_room 방들어감: ", data);
    console.log(socket.rooms);
  });
  socket.on("send_message", (data) => {
    console.log("send: ", data);
    socket.to(data.roomName).emit("receive_message", {
      from: data.from,
      message: data.message,
      time: data.time,
    });
    const saveChat = new Chat({
      from: data.from,
      message: data.message,
      time: data.time,
    });
    saveChat.save();
  });
});

https: server.listen(port, () => {
  console.log(port, "서버가 연결되었습니다.");
});

//io.sockets.emit() 은 나를 포함한 모든 클라이언트에게 전송하고,
//socket.broadcast.emit()은 나를 제외한 모든 클라이언트에게 전송함.

// socket.remoteAddress = socket.request.connection._peername.address; //ip주소
// socket.remotePort = socket.request.connection_peername.port; //post번호

// 'login' 이벤트를 받았을 때의 처리
//  socket.on("login", (input) => {
//   console.log("login 이벤트를 받았습니다." + JSON.stringify(input));

//   // 기존 클라이언트 ID가 없으면 클라이언트 ID를 맵에 추가
//   login_ids[input.id] = socket.id;
//   socket.login_id = input.id;

//   // 응답 메시지 전송
//   sendResponse(socket, "login", "200", "로그인되었습니다.");
// });
// // 'message' 이벤트를 받았을 때의 처리
// socket.on("message", function (message) {
//   console.log("message 이벤트를 받았습니다." + JSON.stringify(message));

//   if (message.recepient == "ALL") {
//     // 나를 포함한 모든 클라이언트에게 메시지 전달
//     console.log(
//       "나를 포함한 모든 클라이언트에게 message 이벤트를 전송합니다."
//     );
//     io.sockets.emit("message", message);
//   } else {
//     // 일대일 채팅 대상에게 메시지 전달
//     if (login_ids[message.recepient]) {
//       io.sockets.connected[login_ids[message.recepient]].emit(
//         "message",
//         message
//       );

//       // 응답 메시지 전송
//       sendResponse(socket, "message", "200", "메시지를 전송했습니다.");
//     } else {
//       // 응답 메시지 전송
//       sendResponse(
//         socket,
//         "message",
//         "404",
//         "상대방의 로그인 ID를 찾을 수 없습니다."
//       );
//     }
//   }
// });

// send:  {
//   roomName: '123123',
//   from: '이한울',
//   message: 'gdgd',
//   time: '2022-05-02 22:21:15'
// }
