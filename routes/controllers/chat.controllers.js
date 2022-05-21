const Message = require("../../schemas/message.schemas");
const ChatData = require("../../schemas/chatData.schemas");
const dayjs = require("dayjs");

const chatData = async (req, res) => {
  // try {
  const { userId } = res.locals.user;

  const roomUser = await Message.find({});
  if (roomUser.length > 0) {
    let chatRoomName = [];
    for (let i = 0; i < roomUser.length; i++) {
      const a = roomUser[i].roomName;
      const b = roomUser[i];
      let chattingUser = a.includes(userId);
      if (chattingUser === true) {
        chatRoomName.push(b);
      }
    }
    let lastMessage = "";
    for (let i = 0; i < chatRoomName.length; i++) {
      const message = chatRoomName[i].messages;
      const roomName = chatRoomName[i].roomName;
      if (message.length !== 0) {
        lastMessage = message[message.length - 1];
      }
      await ChatData.updateOne(
        { "chatRoom.roomName": roomName },
        { $set: { lastMessage: lastMessage.message } }
      );
      await ChatData.updateOne(
        { "chatRoom.roomName": roomName },
        { $set: { lastTime: lastMessage.time } }
      );
    }

    const newChat = await ChatData.findOne({ userId });
    // let newChat = [];
    if (newChat.chatRoom.length > 0) {
      // for (let i = 0; i < newRoomUser.length; i++) {
      //   const chatRoom = newRoomUser[i].chatRoom;
      //   const b = newRoomUser[i];
      //   for (let j = 0; j < chatRoom.length; j++) {
      //     const roomName = chatRoom[j].roomName;
      //     let chattingUser = roomName.includes(userId);
      //     if (chattingUser === true) {
      //       newChat.push(b);
      //     }
      //   }
      // }
      // console.log("newChat", newChat);
      // for (let i = 0; i < newChat.length; i++) {
      //   if (newChat[i].userId === userId) {
      //     newChat[i].chatRoom.targetUser;
      //   } else if (newChat[i].userId === userId) {
      //     newChat[i].chatRoom.targetUser = newChat[i].chatRoom.createUser;
      //   }
      // }
      newChat.chatRoom.sort(
        (a, b) => new dayjs(b.lastTime) - new dayjs(a.lastTime)
      );
      console.log("@@@@@@@@@@@@", newChat);
      // for (let i of newChat) {
      //   i.lastTime = dayjs(i.lastTime).format("YYYY-MM-DD HH:mm:ss");
      // }

      return res.status(200).json({ newChat });
    } else {
      return res.status(200).send({ newChat, msg: "채팅 정보 없음" });
    }
  }
  return res.status(200).send({ newChat, msg: "채팅 정보 없음" });
  // } catch {
  //   res.status(400).send("채팅 목록 조회 실패");
  // }
};

const messages = async (req, res) => {
  const { userId } = res.locals.user;

  const roomUser = await Message.find({});
  try {
    if (roomUser.length > 0) {
      let chatRoom = [];
      for (let i = 0; i < roomUser.length; i++) {
        const a = roomUser[i].roomName;
        const b = roomUser[i];
        let chattingUser = a.includes(userId);
        if (chattingUser === true) {
          chatRoom.push(b);
        }
      }
      res.status(200).json({ chatRoom });
    } else {
      res.status(204).send({ msg: "메시지 정보가 없습니다." });
    }
  } catch (err) {
    res.status(400).send("채팅 목록 조회 실패");
  }
};

module.exports = {
  chatData,
  messages,
};
 */