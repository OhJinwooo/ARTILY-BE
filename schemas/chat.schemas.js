const mongoose = require("mongoose");
const ChatSchema = new mongoose.Schema({
  roomName: {
    type: String,
  },
  post: {
    type: Object,
  },
  CreateUser: {
    type: Object,
  },
  TargetUser: {
    type: Object,
  },
  message: {
    type: Array,
  },
});
module.exports = mongoose.model("Chat", ChatSchema);
