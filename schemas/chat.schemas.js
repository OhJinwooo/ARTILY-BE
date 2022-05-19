const mongoose = require("mongoose");
const ChatSchema = new mongoose.Schema({
  roomName: {
    type: String,
  },
  post: {
    type: Object,
  },
  createUser: {
    type: Object,
  },
  targetUser: {
    type: Object,
  },
  messages: {
    type: Array,
  },
  lastMessage: {
    type: String,
  },
  lastTime: {
    type: Date,
  },
});
module.exports = mongoose.model("Chat", ChatSchema);
