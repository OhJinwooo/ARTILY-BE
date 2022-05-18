const Chat = require("./schemas/chat.schemas");
const User = require("./schemas/user.schemas");
const chatData = require("./schemas/chatData.schemas");
const socket = require("socket.io");

module.exports = (server) => {
  const io = socket(server, {
    // path: "/socket.io",
    cors: {
      origin: "*",
      // methods: ["GET", "POST"],
      // credentials: true,
    },
  });
  console.log("socket 연결");
  io.use(async (socket, next) => {
    const userInfo = socket.handshake.auth.user;
    console.log("use부분", userInfo); // tnwjd
    // 어딘가의 저장소에서 찾고있음
    const session = await chatData.findOne({ userId: userInfo.userId });
    console.log("세션", session);
    const { userId, nickname, profileImage } = userInfo;

    // 비 회원 없음
    if (!userInfo) {
      return next(new Error("에러!!!!!!!"));
    }

    //기존 사람 데이터가 있음
    if (session) {
      socket.userId = userId;
      socket.nickname = nickname;
      socket.id = userId;
      socket.profileImage = profileImage; // tnwjd
      await chatData.updateOne({ userId }, { $set: { connected: true } });
      return next();
    }

    socket.userId = userId;
    socket.nickname = nickname;
    socket.id = userId;
    socket.profileImage = profileImage; // tnwjd

    await chatData.create({ userId, nickname, profileImage, connected: true });
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

    socket.on("join_room", async (roomName, targetUser, post) => {
      socket.join(roomName);
      console.log(socket.id, socket.nickname);
      // const { userId, nickname, profileImage } = socket;
      // 유저 조회해서 상대방 프로필이미지, 닉네임 찾기
      console.log("targetUser", targetUser);
      const target = await User.findOne({ userId: targetUser });

      // const CreateUser = await chatData.findOne(
      //   {
      //     userId: socket.id,
      //   },
      //   "userId nickname profileImage"
      // );
      const TargetUser = await chatData.findOne(
        {
          userId: targetUser,
        },
        "userId nickname profileImage"
      );
      console.log("타겟:", target);
      const receive = {
        post, // postId, imageUrl: current.imageUrl[0], postTitle: current.postTitle, price: current.price,
        roomName,
        // CreateUser,
        TargetUser,
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
      const existRomms = await chatData.findOne({ enteringRoom: roomName });
      console.log("existRomms", existRomms);
      // console.log("existRoom", existRoom);
      if (!existRoom) {
        await Chat.create(receive);
        socket.to(target.userId).emit("join_room", receive);
      }
      if (!existRomms) {
        await chatData.updateOne(
          { userId },
          { $push: { enteringRoom: roomName } }
        );
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
