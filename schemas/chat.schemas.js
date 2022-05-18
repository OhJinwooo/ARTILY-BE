const mongoose = require("mongoose");
const ChatSchema = new mongoose.Schema({
  roomName: {
    type: String,
  },
  post: {
    type: Object,
  },
  targetUser: {
    type: Object,
  },
  messages: {
    type: Array,
  },
  newMessage: {
    type: Number,
  },
  lastMessage: {
    type: String,
  },
  lastTime: {
    type: String,
  },
});
module.exports = mongoose.model("Chat", ChatSchema);
