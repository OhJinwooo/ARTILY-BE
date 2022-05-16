const Chat = require("./schemas/chat.schemas");
const User = require("./schemas/user.schemas");
const chatData = require("./schemas/chatData.schemas");
const socket = require("socket.io");
const { Server } = require("socket.io");
const { createAdapter } = require("@socket.io/redis-adapter");
const { redis } = require("./config/redis.cluster.config");

module.exports = (server) => {
  // const io = socket(server, {
  //   cors: {
  //     origin: "http://localhost:3000",
  //     credentials: true,
  //   },
  // });
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      credentials: true,
      transports: ["websocket"],
    },
  });

  const pubClient = redis;
  const subClient = pubClient.duplicate();

  io.adapter(createAdapter(pubClient, subClient));

  io.use(async (socket, next) => {
    const userInfo = socket.handshake.auth.user;
    console.log("use부분", userInfo); // 수정

    // 비 회원 없음
    if (!userInfo) {
      return next(new Error("에러!!!!!!!"));
    }

    // 어딘가의 저장소에서 찾고있음
    const session = await redis.zrevrange({ userId: userInfo.userId });
    console.log("세션", session);
    const { userId, nickname, profileImage } = userInfo;

    //기존 사람 데이터가 있음
    if (session) {
      socket.userId = userId;
      socket.nickname = nickname;
      socket.id = userId;
      socket.profileImage = profileImage; // tnwjd
      return next();
    }

    socket.userId = userId;
    socket.nickname = nickname;
    socket.id = userId;
    socket.profileImage = profileImage; // tnwjd
    await redis.hset(`user`, userId, nickname, profileImage);
    next();
  });
  io.on("connection", (socket) => {
    const { userId, nickname, profileImage, connected } = socket;
    console.log("연결 : ", userId, nickname, profileImage, connected);
    // 아이디 받아오기
    // socket.on("main", (userId) => {
    //   console.log(`아이디 받아오기: ${userId}`);
    //   socket.userId = userId;
    // });

    // 방 리스트
    // socket.on("roomList", async () => {
    //   console.log("roomList");
    //   const rooms = await Chat.find({}, "post");
    //   socket.emit("roomList", rooms);
    // });

    socket.broadcast.emit("user connected", {
      userId,
      nickname,
      connected,
      // socketID: socket.id,
    });

    // socket.on("login", async (user) => {
    //   const userPk = user.uid;
    //   let id = socket.id;
    //   // zscan 으로 전체 찾는 것 대신 가장 큰거 하나 찾아서 검증하는 zrevrange로 바꿈
    //   // zmemebers가 아무도 없더라도 room, unchecked가 undefined이므로 0과의 비교가 false가 되어 검증 가능
    //   const [room, unchecked] = await redis.zrevrange(
    //     userPk + "",
    //     0,
    //     0,
    //     "WITHSCORES"
    //   );
    //   if (unchecked > 0) await io.sockets.to(id).emit("unchecked");
    //   if (userPk) await redis.hset(`currentOn`, userPk, id);
    // });

    socket.on("join_room", async (roomName, targetUser, post) => {
      socket.join(roomName);
      console.log(socket.id, socket.nickname);
      // const { userId, nickname, profileImage } = socket;
      // 유저 조회해서 상대방 프로필이미지, 닉네임 찾기
      console.log("targetUser", targetUser);
      const target = await User.findOne({ userId: targetUser });

      console.log("타겟:", target);
      const receive = {
        post, // postId, imageUrl: current.imageUrl[0], postTitle: current.postTitle, price: current.price,
        roomName,
        // CreateUser,
        // TargetUser,
        target: socket.userId,
        nickname: socket.nickname, // 상대의
        profileImage: socket.profileImage, // 상대의
        messages: [], //msgList
        newMessage: 0,
        lastMessage: null,
        lastTime: null,
      };
      console.log("receive: ", receive);
      // 여기서 이미 존재하는 방인지 검사해서 없을때만 아래구문 실행해야함
      const existRoom = await Chat.findOne({ roomName: roomName });
      // console.log("existRoom", existRoom);
      if (!existRoom) {
        await Chat.create(receive);
        socket.to(target.userId).emit("join_room", receive);
      }
    });
    socket.on("enter_room", (roomName) => {
      socket.join(roomName);
    });
    socket.on("send_message", async (messageData) => {
      console.log("send_message 받은거:", messageData.roomName);

      const existRoom = await Chat.findOne({ roomName: messageData.roomName });
      if (!existRoom) {
        throw new error();
      }

      const receive = {
        roomName: messageData.roomName,
        from: false,
        message: messageData.message,
        time: messageData.time,
      };
      socket.to(messageData.roomName).emit("receive_message", receive);

      const saveChat = {
        from: socket.id, // 보낸사람 유저아이디
        target: messageData.postUser, // 타겟인 유저 아이디값 받아오기
        message: messageData.message,
        time: messageData.time,
      };

      console.log("saveChat", saveChat);
      await Chat.updateOne(
        { roomName: messageData.roomName },
        { $push: { message: saveChat } }
      );
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
      const user = await chatData.findOne({ userId: socket.id });
      socket.broadcast.emit("user disconnected", user.nickname);
      await chatData.updateOne(
        { userId: user.userId },
        { $set: { connected: false } }
      );
    });
  });
};
