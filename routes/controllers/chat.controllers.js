// const Chat = require("../../schemas/chat.schemas");
// const ChatData = require("../../schemas/chatData.schemas");

// const chatData = async (req, res) => {
//   const { userId } = res.locals.user;

//   const roomUser = await Chat.find({});
//   console.log("roomUser", roomUser);
//   for (let i = 0; i < roomUser.length; i++) {
//     const message = roomUser[i].messages;
//     console.log("message", message);

//     if (message.length !== 0) {
//       const lastMessage = message[message.length - 1];
//       console.log("last", lastMessage);
//     }
//     await ChatData.updateOne(
//       { userId },
//       { $set: { lastMessage: lastMessage.message } }
//     );
//     await ChatData.updateOne(
//       { userId },
//       { $set: { lastMessage: lastMessage.time } }
//     );
//   }
//   let chatRoomName = [];
//   for (let i = 0; i < roomUser.length; i++) {
//     const a = roomUser[i].roomName;
//     const b = roomUser[i];
//     let chattingUser = a.includes(userId);
//     if (chattingUser === true) {
//       chatRoomName.push(b);
//     }
//     // console.log("chattingUser", chattingUser);
//     // console.log("chatRoomName", chatRoomName);
//   }

//   res.json({ chatRoomName });
// };

// module.exports = {
//   chatData,
// };
// // includes(userId);

const Chat = require("../../schemas/chat.schemas");
const ChatData = require("../../schemas/chatData.schemas");
const chatData = async (req, res) => {
  const { userId } = res.locals.user;
  const roomUser = await Chat.find({});
  console.log("roomUser", roomUser);
  const lastMessage = "";
  for (let i = 0; i < roomUser.length; i++) {
    let message = roomUser[i].messages;
    console.log("message", message);
    if (message.length !== 0) {
      const lastMessage = message[message.length - 1];
      console.log("last", lastMessage);
      console.log("lastMessage.message", lastMessage.message);
    }
    await Chat.updateOne({}, { $set: { lastMessage: lastMessage.message } });
    await Chat.updateOne({}, { $set: { lastTime: lastMessage.time } });
  }
  let chatRoomName = [];
  for (let i = 0; i < roomUser.length; i++) {
    const a = roomUser[i].roomName;
    const b = roomUser[i];
    let chattingUser = a.includes(userId);
    if (chattingUser === true) {
      chatRoomName.push(b);
    }
    // console.log("chattingUser", chattingUser);
    // console.log("chatRoomName", chatRoomName);
  }
  res.json({ chatRoomName });
};
module.exports = {
  chatData,
};
// includes(userId);
