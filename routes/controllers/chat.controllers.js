const Message = require("../../schemas/message.schemas");
const ChatData = require("../../schemas/chatData.schemas");
const { logger } = require("../../middleware/logger");
const dayjs = require("dayjs");

const chatData = async (req, res) => {
  try {
    const { userId } = res.locals.user;
    const newChat = await ChatData.findOne({ userId });
    if (newChat.chatRoom.length > 0) {
      newChat.chatRoom.sort(
        (a, b) => new dayjs(b.lastTime) - new dayjs(a.lastTime)
      );

      return res.status(200).json({ newChat });
    } else {
      return res.status(200).send({ newChat, msg: "채팅 정보 없음" });
    }
  } catch {
    logger.error("chat");
    res.status(400).send("채팅 목록 조회 실패");
  }
};

const messages = async (req, res) => {
  const { userId } = res.locals.user;
  const { roomname } = req.params;

  const roomUser = await Message.findOne({ roomName: roomname });
  try {
    if (roomUser.messages.length > 0) {
      await ChatData.updateOne(
        { userId: userId, "chatRoom.roomName": roomname },
        { $set: { "chatRoom.$.newMessage": 0 } }
      );
      res.status(200).json({ roomUser });
    } else {
      res.status(200).send({ roomUser, msg: "메시지 정보가 없습니다." });
    }
  } catch (err) {
    logger.error("chat");
    res.status(400).send("채팅 목록 조회 실패");
  }
};

module.exports = {
  chatData,
  messages,
};
