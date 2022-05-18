const Chat = require("../../schemas/chat.schemas");
const ChatData = require("../../schemas/chatData.schemas");

const chatData = async (req, res) => {
  const { userId } = res.locals.user;

  const roomUser = await Chat.find({});
  console.log("roomUser", roomUser);

  for (let i = 0; i < roomUser.length; i++) {
    let message = roomUser[i].messages;
    console.log("msg", message);

    const lastMessage = message[message.length - 1];
    console.log("last", lastMessage);

    await ChatData.updateOne(
      { userId },
      { $set: { lastMessage: lastMessage.message } }
    );
    await ChatData.updateOne(
      { userId },
      { $set: { lastMessage: lastMessage.time } }
    );
  }
  let chatRoomName = [];
  for (let i = 0; i < roomUser.length; i++) {
    const a = roomUser[i].roomName;
    const b = roomUser[i];
    chattingUser = a.includes(userId);
    if (chattingUser === true) {
      chatRoomName.push(b);
    }
  }

  res.json({ chatRoomName });
};

module.exports = {
  chatData,
};
// includes(userId);
