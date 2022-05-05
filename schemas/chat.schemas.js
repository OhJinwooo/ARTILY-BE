const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema({
  // 소켓 db schema 생성
  from: {
    type: String,
  },
  message: {
    type: String,
  },
  time: {
    type: String,
  },
  profileImg: {
    type: String,
  },
  roomName: {
    type: String,
  },
});

module.exports = mongoose.model("Chat", ChatSchema);
