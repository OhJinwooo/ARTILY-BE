<<<<<<< HEAD
// const Chat = require("./schemas/chat.schemas");
// const User = require("./schemas/user.schemas");
// const crypto = require("crypto");
// const randomId = () => crypto.randomBytes(8).toString("hex");
// const { InMemorySessionStore } = require("./sessionStore");
// const sessionStore = new InMemorySessionStore();
// const socket = require("socket.io");
// module.exports = (server) => {
//   const io = socket(server, {
//     cors: {
//       origin: "http://localhost:3000",
//       credentials: true,
//     },
//   });
//   io.use((socket, next) => {
//     const sessionID = socket.handshake.auth.sessionID;
//     const userInfo = socket.handshake.auth.userInfo;
//     console.log("use부분", sessionID, userInfo); // tnwjd
//     if (sessionID) {
//       // 어딘가의 저장소에서 찾고있음
//       const session = sessionStore.findSession(userInfo.userId);
//       console.log("세션", session);
//       if (session) {
//         socket.sessionID = sessionID;
//         socket.userId = userInfo.userId;
//         socket.nickname = userInfo.nickname;
//         socket.id = userInfo.userId;
//         socket.profileImage = userInfo.profileImage; // tnwjd
//         return next();
//       }
//     }
//     if (!userInfo) {
//       return next(new Error("에러!!!!!!!"));
//     }
//     if (!sessionID) socket.sessionID = randomId();
//     socket.userId = userInfo.userId;
//     socket.nickname = userInfo.nickname;
//     socket.id = userInfo.userId;
//     socket.profileImage = userInfo.profileImage; // tnwjd
//     next();
//   });
//   io.on("connection", (socket) => {
//     console.log("연결 : ", socket.sessionID, socket.id);
//     // 별의미없음
//     socket.emit("session", {
//       sessionID: socket.sessionID,
//       userId: socket.userId,
//       profileImage: socket.profileImage,
//       nickname: socket.nickname,
//     });
//     sessionStore.saveSession(socket.userId, {
//       userId: socket.userId,
//       sessionID: socket.sessionID,
//       nickname: socket.nickname,
//       profileImage: socket.profileImage,
//       connected: true,
//     });
//     // 크게중요한거아님
//     socket.broadcast.emit("user connected", {
//       userId: socket.userId,
//       nickname: socket.nickname,
//       sessionID: socket.sessionID,
//       // socketID: socket.id,
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
//       console.log("receive: ", receive);
//       // 여기서 이미 존재하는 방인지 검사해서 없을때만 아래구문 실행해야함
//       socket.to(target.userId).emit("join_room", receive);
//     });
//     socket.on("enter_room", (roomName) => {
//       socket.join(roomName);
//     });
//     socket.on("send_message", (messageData) => {
//       console.log("send_message 받은거:", messageData);
//       const receive = {
//         roomName: messageData.roomName,
//         from: false,
//         message: messageData.message,
//         time: messageData.time,
//       };
//       socket.to(messageData.roomName).emit("receive_message", receive);
//       const saveChat = new Chat({
//         roomName: messageData.roomName,
//         from: socket.id, // 보낸사람 유저아이디
//         message: messageData.message,
//         time: messageData.time,
//       });
//       saveChat.save();
//     });
//     socket.on("upload", (data) => {
//       console.log("upload 받은거:", data);
//       console.log(JSON.stringify(data));
//     });
//     socket.on("leave_room", (roomName) => {
//       console.log("방이름", roomName);
//       const admin_notification = {
//         roomName,
//         from: "admin",
//         message: "상대방이 대화방을 나갔습니다",
//         time: new Date() + "",
//       };
//       socket.to(roomName).emit("admin_noti", admin_notification);
//     });
//     socket.on("disconnect", async () => {
//       const matchingSockets = await io.in(socket.userId).allSockets();
//       console.log("디스커넥트", matchingSockets);
//       const isDisconnected = matchingSockets.size === 0;
//       if (isDisconnected) {
//         // notify other users
//         socket.broadcast.emit("user disconnected", socket.nickname);
//         // update the connection status of the session
//         sessionStore.saveSession(socket.sessionID, {
//           userId: socket.userId,
//           nickname: socket.nickname,
//           connected: false,
//         });
//       }
//     });
//   });
// };
=======
const Chat = require("./schemas/chat.schemas");
const User = require("./schemas/user.schemas");
const crypto = require("crypto");
const randomId = () => crypto.randomBytes(8).toString("hex");
const { InMemorySessionStore } = require("./sessionStore");
const sessionStore = new InMemorySessionStore();
const socket = require("socket.io");

module.exports = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:3000",
      credentials: true,
    },
  });

  io.use((socket, next) => {
    const sessionID = socket.handshake.auth.sessionID;
    const userInfo = socket.handshake.auth.userInfo;
    console.log("use부분", sessionID, userInfo); // tnwjd
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
};
>>>>>>> 71a4aa92f2a1b4176a1dc401dcaa353acbe0fca0
