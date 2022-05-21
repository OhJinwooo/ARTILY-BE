const mongoose = require("mongoose");
const messagesSchema = new mongoose.Schema({
  roomName: {
    type: String,
  },
  messages: {
    type: Array,
  },
});
module.exports = mongoose.model("message", messagesSchema);
