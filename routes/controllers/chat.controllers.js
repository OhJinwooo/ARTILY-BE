const Chat = require("../../schemas/chat.schemas");

const chatData = async (req, res) => {
  const { userId } = res.locals.user;

  const roomUser = await Chat.find({});
  console.log("roomUser", roomUser);
  let chattingUser = "";
  let chatRoomName = [];
  for (let i = 0; i < roomUser.length; i++) {
    const a = roomUser[i].roomName;
    const b = roomUser[i];
    chattingUser = a.includes(userId);
    if (chattingUser === true) {
      chatRoomName.push(b);
    }
    console.log("chattingUser", chattingUser);
    console.log("chatRoomName", chatRoomName);
  }

  res.json({ chatRoomName });
};

module.exports = {
  chatData,
};
// includes(userId);
