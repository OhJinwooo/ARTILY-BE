const mongoose = require("mongoose");
const ChatSchema = new mongoose.Schema({
  roomName: {
    type: String,
  },
  target: {
    type: String,
  },
  to: {
    type: String,
  },
  message: {
    type: String,
  },
  time: {
    type: String,
  },
});
module.exports = mongoose.model("Chat", ChatSchema);
