const Chat = require("../../schemas/chat.schemas");
const dayjs = require("dayjs");
const chatData = async (req, res) => {
  // try {
  const { userId } = res.locals.user;

  const roomUser = await Chat.find({});
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
      await Chat.updateOne(
        { roomName },
        { $set: { lastMessage: lastMessage.message } }
      );
      await Chat.updateOne(
        { roomName },
        { $set: { lastTime: lastMessage.time } }
      );
    }

    const newRoomUser = await Chat.find({});
    let newChat = [];
    if (newRoomUser.length > 0) {
      for (let i = 0; i < newRoomUser.length; i++) {
        const a = newRoomUser[i].roomName;
        const b = newRoomUser[i];
        let chattingUser = a.includes(userId);
        if (chattingUser === true) {
          newChat.push(b);
        }
      }
      for (let i = 0; i < newChat.length; i++) {
        if (newChat[i].createUser.userId === userId) {
          newChat[i].targetUser;
        } else if (newChat[i].targetUser.userId === userId) {
          newChat[i].targetUser = newChat[i].createUser;
          newChat[i].createUser = newChat[i].targetUser;
        }
      }
      newChat.sort((a, b) => new dayjs(b.lastTime) - new dayjs(a.lastTime));
      console.log("@@@@@@@@@@@@", newChat);
      // for (let i of newChat) {
      //   i.lastTime = dayjs(i.lastTime).format("YYYY-MM-DD HH:mm:ss");
      // }

      return res.status(200).json({ newChat });
    } else {
      return res.status(204).send({ msg: "채팅 정보 없음" });
    }
  }
  return res.status(204).send({ msg: "채팅 정보 없음" });
  // } catch {
  //   res.status(400).send("채팅 목록 조회 실패");
  // }
};
module.exports = {
  chatData,
};
