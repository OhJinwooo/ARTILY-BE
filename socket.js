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
  io.on("connection", (socket) => {
    console.log("연결 : ", socket.sessionID, socket.id);
  });
  socket.on("join_room", (roomName, targetUser, post) => {
    socket.join(roomName);
    console.log(socket.id, socket.nickname);
    const { userId, nickname, profileImage } = socket;
    // 유저 조회해서 상대방 프로필이미지, 닉네임 찾기
    const target = User.findOne({ userId: targetUser });
    console.log("타겟:", target);
    const receive = {
      post, // postId, imageUrl: current.imageUrl[0], postTitle: current.postTitle, price: current.price,
      roomName,
      target: userId, // 상대의 유저 아이디
      nickname, // 상대의
      profileImage: profileImage, // 상대의
      messages: [msglist],
      newMessage: 0,
      lastMessage: null,
      lastTime: null,
    };
    console.log("receive: ", receive);
    // 여기서 이미 존재하는 방인지 검사해서 없을때만 아래구문 실행해야함
    const existRoom = User.findOne({ roomName });
    if (!existRoom) {
      socket.to(target.userId).emit("join_room", receive);
    }
    e;
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
};
