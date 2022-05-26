const Message = require("./schemas/message.schemas");
const chatData = require("./schemas/chatData.schemas");
const socket = require("socket.io");

module.exports = (server) => {
  //socket에는 프론트단에서 채팅을 보낸 user정보를 보내주는건지?
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
    // 어딘가의 저장소에서 찾고있음
    const session = await chatData.findOne({ userId: userInfo.userId });
    const { userId, nickname, profileImage } = userInfo;

    // 비 회원 없음
    if (!userInfo) {
      // userInfo 자체가 안넘어왔을 때 대비.
      return next(new Error("에러!!!!!!!"));
    }

    //기존 사람 데이터가 있음
    if (session) {
      console.log("데이터가 있음");
      socket.userId = userId;
      socket.nickname = nickname;
      socket.id = userId;
      socket.profileImage = profileImage;

      await chatData.updateOne(
        { userId: userId },
        { $set: { connected: true } } // 채팅방에서 접속한 유저정보 띄우주려고 사용 = > 혹시몰라서 보류
      );

      return next();
    }
    console.log("데이터가 없음");
    socket.userId = userId;
    socket.nickname = nickname;
    socket.id = userId;
    socket.profileImage = profileImage;

    await chatData.create({
      userId,
      connected: true,
      chatRoom: [],
    });
    next();
  });

  //io.on 프론트와 백 연결
  io.on("connection", async (socket) => {
    const { userId, nickname, profileImage, connected } = socket;

    const result = await chatData.findOne({ userId }, "chatRoom");
    const chatRoom = result.chatRoom;
    //이미 방을  만들어놓은 유저들이 로그인 했을때 조인을 시켜줌
    if (chatRoom.length > 0) {
      for (let i = 0; i < chatRoom.length; i++) {
        // 로그인 되어있는 유저가 속해있는 채팅방 리스트
        socket.join(chatRoom[i].roomName);
      }
    }

    //로그인한 유저 정보를 프론트에게 보내줌 / test 확인용
    socket.broadcast.emit("user connected", {
      userId,
      nickname,
      connected: true,
    });

    //처음 방을 만들었을 때 방이름을 프론트에서 만들어 보내면 유저 정보에 저장을 하고 조인을 시킴
    socket.on("join_room", async (roomName, targetUser, post) => {
      socket.join(roomName);

      //방을 만든사람의 정보
      const nowUser = {
        //현재 로그인된 유저의 정보
        userId: socket.userId,
        nickname: socket.nickname,
        profileImage: socket.profileImage,
      };

      //만들어진 방의 상대방 유저 정보
      const target = {
        userId: targetUser.userId,
        nickname: targetUser.nickname,
        profileImage: targetUser.profileImage,
      };

      //프론트에게 다시 보내줄 정보
      const receive = {
        post, // postId, imageUrl: current.imageUrl[0], postTitle: current.postTitle, price: current.price,
        roomName,
        targetUser: nowUser,
        newMessage: 0,
        lastMessage: null,
        lastTime: null,
      };

      //데이터 베이스에 저장할 정보 채팅 내용( messages )
      const saveData = {
        roomName,
        messages: [],
      };

      //데이터 베이스에 저장할 정보 채팅 방에 대한 정보( chatData )
      const chatRoom = {
        roomName: roomName,
        post: post,
        lastMessage: null,
        lastTime: null,
        newMessage: 0,
        targetUser: nowUser,
        createUser: target,
      };
      // 여기서 이미 존재하는 방인지 검사해서 없을때만 아래구문 실행해야함
      const existRoom = await Message.findOne({ roomName: roomName });
      const existRooms = await chatData.findOne({
        "chatRoom.roomName": roomName,
      });
      // console.log("existRoom", existRoom);

      //채팅방 채팅 내용에 대한 정보가 없을 때 채팅 내용을 저장하는 컬렉션을 생성
      if (!existRoom) {
        await Message.create(saveData); // 유저정보 둘다 있는 데이터
        socket.to(targetUser.userId).emit("join_room", receive); //상대방에게 receive 정보 전달
      }

      //채팅방에 대한  정보가 없을 때 해당 유저의 채팅방 정보를 저장
      if (!existRooms) {
        await chatData.updateOne({ userId }, { $push: { chatRoom: chatRoom } });
        await chatData.updateOne(
          { userId: targetUser.userId },
          { $push: { chatRoom: chatRoom } }
        );
      }
    });

    //채팅방을 다시한번 조인 시켜줌
    socket.on("enter_room", async (roomName) => {
      socket.join(roomName);
      // socket.to(chatRoom[i].userId).emit("enter_room", chatRoom[i].roomName);
    });

    //메시지 받은 정보를 저장함
    socket.on("send_message", async (messageData) => {
      console.log("send_message 받은거:", messageData.roomName);

      //채팅 내용에대한 정보가 있는지  확인
      const existRoom = await Message.findOne({
        roomName: messageData.roomName,
      });
      // const receiveMessage= await  Chat.find({userId})

      //없으면 에러 무조건 생성이 되어 있어야됨
      if (!existRoom) {
        throw new error();
      }

      //프론트에게 보내줄 받은 메시지 데이터
      const receive = {
        roomName: messageData.roomName,
        from: false,
        message: messageData.message,
        time: messageData.time,
        // message: existRoom.lastMessage,
        // time: existRoom.lastTime,
      };
      socket.to(messageData.roomName).emit("receive_message", receive);

      //디비에  저장해줄 데이터
      const saveChat = {
        from: socket.id,
        message: messageData.message,
        time: messageData.time,
      };

      console.log("saveChat", saveChat);
      //받은 메세지 저장
      await Message.updateOne(
        { roomName: messageData.roomName },
        { $push: { messages: saveChat } }
      );

      //마지막에 작성된 메세지, 마지막으로 메시지 받은 시간 업데이트
      await chatData.updateOne(
        {
          userId: messageData.from,
          "chatRoom.roomName": messageData.roomName,
        },
        { $set: { "chatRoom.$.lastMessage": messageData.message } }
      );
      await chatData.updateOne(
        {
          userId: messageData.from,
          "chatRoom.roomName": messageData.roomName,
        },
        { $set: { "chatRoom.$.lastTime": messageData.time } }
      );

      await chatData.updateOne(
        {
          userId: messageData.to,
          "chatRoom.roomName": messageData.roomName,
        },
        { $set: { "chatRoom.$.lastMessage": messageData.message } }
      );
      await chatData.updateOne(
        {
          userId: messageData.to,
          "chatRoom.roomName": messageData.roomName,
        },
        { $set: { "chatRoom.$.lastTime": messageData.time } }
      );

      //상대방에게 메세지를 보냈을때 숫자 1 증가
      if (messageData.to) {
        await chatData.updateOne(
          {
            userId: messageData.to,
            "chatRoom.roomName": messageData.roomName,
          },
          { $inc: { "chatRoom.$.newMessage": 1 } }
        );
      }
    });

    //채팅방에 들어갔을 때 읽었으니 newMessage 숫자는 0으로 바꿔줌
    socket.on("check_chat", async (roomName) => {
      await chatData.updateOne(
        { userId: userId, "chatRoom.roomName": roomName },
        { $set: { "chatRoom.$.newMessage": 0 } }
      );
    });

    // 채팅방을 나갔을 때
    socket.on("leave_room", async (roomName, targetUser) => {
      console.log("방이름", roomName);
      const admin_notification = {
        roomName,
        from: "admin",
        message: "상대방이 대화방을 나갔습니다",
        time: new Date() + "",
      };

      // 내 정보 찾기
      const result = await chatData.findOne({
        userId: userId,
        "chatRoom.roomName": roomName,
      });
      console.log("result", result);
      let myRoom;
      if (result) {
        myRoom = result.chatRoom;
        console.log("myRoom", myRoom);
      }

      //상대방 정보를 찾기
      const results = await chatData.findOne({
        userId: targetUser,
        "chatRoom.roomName": roomName,
      });
      console.log("results", results);

      if (result) {
        for (let i = 0; i < myRoom.length; i++) {
          if (chatRoom[i].roomName === roomName) {
            console.log("조건문 들어옴", chatRoom[i].roomName, roomName);
            await chatData.updateOne(
              { userId: userId, "chatRoom.roomName": roomName },
              { $pull: { chatRoom: chatRoom[i] } }
            );
          }
        }
      }
      if (!results) {
        await Message.deleteOne({ roomName: roomName });
        return;
      }
      socket.to(roomName).emit("admin_noti", admin_notification);
    });

    //상대방이 로그아웃을 하면 false로 변경해줌 지금은 딱히 필요없어졌음 실시간 접속 사용 안함.
    socket.on("disconnect", async () => {
      // const user = await chatData.findOne({ userId: socket.id });
      await chatData.updateOne(
        { userId: userId },
        { $set: { connected: false } }
      );

      const newUser = await chatData.findOne({ userId: socket.id });
      socket.broadcast.emit(
        "user disconnected",
        newUser.userId,
        newUser.connected
      );
    });
  });
};
