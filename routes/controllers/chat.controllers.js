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
  // console.log("roomUser", roomUser);

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

  let lastMessage = "";
  for (let i = 0; i < chatRoomName.length; i++) {
    const message = chatRoomName[i].messages;
    const roomName = chatRoomName[i].roomName;
    console.log("message", roomName);
    if (message.length !== 0) {
      lastMessage = message[message.length - 1];
      console.log("last", lastMessage);
      console.log("lastMessage.message", lastMessage.message);
    }
    const a = await Chat.updateOne(
      { roomName },
      { $set: { lastMessage: lastMessage.message } }
    );
    console.log("@@@@@@@@@@@", a);
    await Chat.updateOne(
      { roomName },
      { $set: { lastTime: lastMessage.time } }
    );
  }

  const newRoomUser = await Chat.find(
    {},
    "roomName post targetUser newMessage lastMessage lastTime"
  );
  const newChat = [];
  for (let i = 0; i < newRoomUser.length; i++) {
    const a = newRoomUser[i].roomName;
    const b = newRoomUser[i];
    let chattingUser = a.includes(userId);
    if (chattingUser === true) {
      newChat.push(b);
    }
    // console.log("chattingUser", chattingUser);
    // console.log("chatRoomName", chatRoomName);
  }

  res.json({ newChat });
};
module.exports = {
  chatData,
};
