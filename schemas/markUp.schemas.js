const mongoose = require("mongoose");

const markUpSchema = new mongoose.Schema({
  userId: {
    type: String,
  },
  postId: {
    type: String,
  },
});

module.exports = mongoose.model("markUp", markUpSchema);
