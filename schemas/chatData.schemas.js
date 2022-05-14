const mongoose = require("mongoose");
const ChatDataSchema = new mongoose.Schema({
  userId: {
    type: String,
  },
  nickname: {
    type: String,
  },
  profileImage: {
    type: String,
  },
  connected: {
    type: Boolean,
    default: false,
  },
});
module.exports = mongoose.model("ChatData", ChatDataSchema);
