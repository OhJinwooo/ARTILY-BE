// const express = require("express");
// const http = require("http");
// const app = express();
// const path = require("path");
// const server = http.createServer(app);
// const socketIO = require("socket.io");
// const moment = require("moment");
// const connect = require("./schemas/index.schemas");
// const Chat = require("./schemas/chat.schemas");

// connect();
// const io = socketIO(server);

// app.use(express.static(path.join(__dirname, "src")));
// const PORT = process.env.PORT || 5000;

// io.on("connection", (socket) => {
//   socket.on("chatting", (data) => {
//     //on 받기 emit 보내기
//     //채팅 아이디 입력 값 받아오기
//     console.log(data);
//     const { name, msg } = data;

//     io.emit("chatting", {
//       name,
//       msg,
//       time: moment(new Date()).format("h:mm A"),
//     });
//   });
// });

// server.listen(PORT, () => console.log(`server is running ${PORT}`));

// send:  {
//   roomName: '123123',
//   from: '이한울',
//   message: 'gdgd',
//   time: '2022-05-02 22:21:15'
// }

// const ioo = socketIO(server, {
//   cors: {
//     origin: "http://localhost:3000",
//     credentials: true,
//   },
// });
// global.onlineUsers = new Map();
// io.on("connection", (socket) => {
//   console.log("연결 connect: ", socket.id);
//   // console.log("globalChatSocket: ", global.chatSocket);
//   socket.on("disconnect", () => {
//     console.log("디스커넥트 disconnect: ", socket.id);
//   });
//   socket.on("join_room", (data) => {
//     socket.join(data);
//     console.log("join_room 방들어감: ", data);
//     console.log(socket.rooms);
//   });
//   socket.on("send_message", (data) => {
//     console.log("send: ", data);
//     socket.to(data.roomName).emit("receive_message", data);
//   });
// });

// require("dotenv").config();
// const redis = require("redis");
// const redisAdapter = require("redis-adapter");
// const client = redis.createClient();
// //Require the express moule
// const express = require("express");

// //create a new express application
// const app = express();

// //require the http module
// const http = require("http").Server(app);

// // require the socket.io module
// // const io = require("socket.io");

// //database connection
// const Chat = require("./schemas/chat.schemas");
// const connect = require("./schemas/index.schemas");

// // const socket = io(http);
// const socket = require("socket.io");
// //create an event listener

// const server = app.listen(process.env.PORT, () => {
//   console.log(`Server running on Port ${process.env.PORT}`);
// });
// const crypto = require("crypto");
// const randomId = () => crypto.randomBytes(8).toString("hex");
// const { InMemorySessionStore } = require("./sessionStore");
// const sessionStore = new InMemorySessionStore();
// const io = socket(server, {
//   cors: {
//     origin: "http://localhost:3000",
//     credentials: true,
//   },
// });
// io.use((socket, next) => {
//   const sessionID = socket.handshake.auth.sessionID;
//   const userInfo = socket.handshake.auth.userInfo;
//   console.log("use부분", sessionID, userInfo.profileImage); // tnwjd
//   if (sessionID) {
//     // 어딘가의 저장소에서 찾고있음
//     const session = sessionStore.findSession(userInfo.userId);
//     console.log("세션", session);
//     if (session) {
//       socket.sessionID = sessionID;
//       socket.userId = userInfo.userId;
//       socket.nickname = userInfo.nickname;
//       socket.id = userInfo.userId;
//       socket.profileImage = userInfo.profileImage; // tnwjd
//       return next();
//     }
//   }
//   if (!userInfo) {
//     return next(new Error("에러!!!!!!!"));
//   }
//   if (!sessionID) socket.sessionID = randomId();
//   socket.userId = userInfo.userId;
//   socket.nickname = userInfo.nickname;
//   socket.id = userInfo.userId;
//   socket.profileImage = userInfo.profileImage; // tnwjd
//   next();
// });
// io.on("connection", (socket) => {
//   console.log("연결 : ", socket.sessionID, socket.id);
//   // 별의미없음
//   socket.emit("session", {
//     sessionID: socket.sessionID,
//     userId: socket.userId,
//     profileImage: socket.profileImage,
//     nickname: socket.nickname,
//   });
//   sessionStore.saveSession(socket.userId, {
//     userId: socket.userId,
//     sessionID: socket.sessionID,
//     nickname: socket.nickname,
//     profileImage: socket.profileImage,
//     connected: true,
//   });
//   // 크게중요한거아님
//   socket.broadcast.emit("user connected", {
//     userId: socket.userId,
//     nickname: socket.nickname,
//     sessionID: socket.sessionID,
//     // socketID: socket.id,
//   });
//   socket.on("join_room", (roomName, targetUser, post) => {
//     socket.join(roomName);
//     console.log(socket.id, socket.nickname);
//     const { userId, nickname, profileImage } = socket;
//     // 유저 조회해서 상대방 프로필이미지, 닉네임 찾기
//     const target = sessionStore.findSession(targetUser);
//     console.log("타겟:", target);
//     const receive = {
//       post,
//       roomName,
//       target: userId,
//       nickname,
//       profileImage: profileImage,
//       messages: [],
//       newMessage: 0,
//       lastMessage: null,
//       lastTime: null,
//     };
//     console.log("receive: ", receive);
//     // 여기서 이미 존재하는 방인지 검사해서 없을때만 아래구문 실행해야함
//     socket.to(target.userId).emit("join_room", receive);
//   });
//   socket.on("enter_room", (roomName) => {
//     socket.join(roomName);
//   });
//   socket.on("send_message", (messageData) => {
//     console.log("send_message 받은거:", messageData);
//     const receive = {
//       roomName: messageData.roomName,
//       from: false,
//       message: messageData.message,
//       time: messageData.time,
//     };
//     socket.to(messageData.roomName).emit("receive_message", receive);
//     const saveChat = new Chat({
//       roomName: messageData.roomName,
//       from: socket.id, // 보낸사람 유저아이디
//       message: messageData.message,
//       time: messageData.time,
//     });
//     saveChat.save();
//   });
//   socket.on("upload", (data) => {
//     console.log("upload 받은거:", data);
//     console.log(JSON.stringify(data));
//   });
//   socket.on("leave_room", (roomName) => {
//     console.log("방이름", roomName);
//     const admin_notification = {
//       roomName,
//       from: "admin",
//       message: "상대방이 대화방을 나갔습니다",
//       time: new Date() + "",
//     };
//     socket.to(roomName).emit("admin_noti", admin_notification);
//   });
//   socket.on("disconnect", async () => {
//     const matchingSockets = await io.in(socket.userId).allSockets();
//     console.log("디스커넥트", matchingSockets);
//     const isDisconnected = matchingSockets.size === 0;
//     if (isDisconnected) {
//       // notify other users
//       socket.broadcast.emit("user disconnected", socket.nickname);
//       // update the connection status of the session
//       sessionStore.saveSession(socket.sessionID, {
//         userId: socket.userId,
//         nickname: socket.nickname,
//         connected: false,
//       });
//     }
//   });
// });

//wire up the server to listen to our port 500

// //To listen to messages
// socket.on("connection", (socket) => {
//   console.log("user connected");
// });

// socket.on("connection", (socket) => {
//   console.log("user connected");
//   socket.on("disconnect", () => {
//     console.log("Disconnected");
//   });
// });

// //setup event listener
// socket.on("connection", (socket) => {
//   console.log("user connected");
//   socket.on("disconnect", function () {
//     console.log("user disconnected");
//   });
//   socket.on("chat message", function (msg) {
//     console.log("message: " + msg);
//     //broadcast message to everyone in port:5000 except yourself.
//     socket.broadcast.emit("received", { message: msg });

//     //save chat to the database
//     connect.then((db) => {
//       console.log("connected correctly to the server");

//       let chatMessage = new Chat({ message: msg, sender: "Anonymous" });
//       chatMessage.save();
//     });
//   });
// });

const server = app.listen(process.env.PORT, () => {
  console.log(`Server running on Port ${process.env.PORT}`);
});
const crypto = require("crypto");
const randomId = () => crypto.randomBytes(8).toString("hex");
const { InMemorySessionStore } = require("./sessionStore");
const sessionStore = new InMemorySessionStore();
const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});
io.use((socket, next) => {
  const sessionID = socket.handshake.auth.sessionID;
  const userInfo = socket.handshake.auth.userInfo;
  console.log("use부분", sessionID, userInfo.profileImage); // tnwjd
  if (sessionID) {
    // 어딘가의 저장소에서 찾고있음
    const session = sessionStore.findSession(userInfo.userId);
    console.log("세션", session);
    if (session) {
      socket.sessionID = sessionID;
      socket.userId = userInfo.userId;
      socket.nickname = userInfo.nickname;
      socket.id = userInfo.userId;
      socket.profileImage = userInfo.profileImage; // tnwjd
      return next();
    }
  }
  if (!userInfo) {
    return next(new Error("에러!!!!!!!"));
  }
  if (!sessionID) socket.sessionID = randomId();
  socket.userId = userInfo.userId;
  socket.nickname = userInfo.nickname;
  socket.id = userInfo.userId;
  socket.profileImage = userInfo.profileImage; // tnwjd
  next();
});
io.on("connection", (socket) => {
  console.log("연결 : ", socket.sessionID, socket.id);
  // 별의미없음
  socket.emit("session", {
    sessionID: socket.sessionID,
    userId: socket.userId,
    profileImage: socket.profileImage,
    nickname: socket.nickname,
  });
  sessionStore.saveSession(socket.userId, {
    userId: socket.userId,
    sessionID: socket.sessionID,
    nickname: socket.nickname,
    profileImage: socket.profileImage,
    connected: true,
  });
  // 크게중요한거아님
  socket.broadcast.emit("user connected", {
    userId: socket.userId,
    nickname: socket.nickname,
    sessionID: socket.sessionID,
    // socketID: socket.id,
  });
  socket.on("join_room", (roomName, targetUser, post) => {
    socket.join(roomName);
    console.log(socket.id, socket.nickname);
    const { userId, nickname, profileImage } = socket;
    // 유저 조회해서 상대방 프로필이미지, 닉네임 찾기
    const target = sessionStore.findSession(targetUser);
    console.log("타겟:", target);
    const receive = {
      post,
      roomName,
      target: userId,
      nickname,
      profileImage: profileImage,
      messages: [],
      newMessage: 0,
      lastMessage: null,
      lastTime: null,
    };
    console.log("receive: ", receive);
    // 여기서 이미 존재하는 방인지 검사해서 없을때만 아래구문 실행해야함
    socket.to(target.userId).emit("join_room", receive);
  });
  socket.on("enter_room", (roomName) => {
    socket.join(roomName);
  });
  socket.on("send_message", (messageData) => {
    console.log("send_message 받은거:", messageData);
    const receive = {
      roomName: messageData.roomName,
      from: false,
      message: messageData.message,
      time: messageData.time,
    };
    socket.to(messageData.roomName).emit("receive_message", receive);
    const saveChat = new Chat({
      roomName: messageData.roomName,
      from: socket.id, // 보낸사람 유저아이디
      message: messageData.message,
      time: messageData.time,
    });
    saveChat.save();
  });
  socket.on("upload", (data) => {
    console.log("upload 받은거:", data);
    console.log(JSON.stringify(data));
  });
  socket.on("leave_room", (roomName) => {
    console.log("방이름", roomName);
    const admin_notification = {
      roomName,
      from: "admin",
      message: "상대방이 대화방을 나갔습니다",
      time: new Date() + "",
    };
    socket.to(roomName).emit("admin_noti", admin_notification);
  });
  socket.on("disconnect", async () => {
    const matchingSockets = await io.in(socket.userId).allSockets();
    console.log("디스커넥트", matchingSockets);
    const isDisconnected = matchingSockets.size === 0;
    if (isDisconnected) {
      // notify other users
      socket.broadcast.emit("user disconnected", socket.nickname);
      // update the connection status of the session
      sessionStore.saveSession(socket.sessionID, {
        userId: socket.userId,
        nickname: socket.nickname,
        connected: false,
      });
    }
  });
});
