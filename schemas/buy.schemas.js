const mongoose = require("mongoose");

const buySchema = new mongoose.Schema({
  userId: {
    type: String,
  },
  postId: {
    type: String,
  },
  createdAt:{
    type: String
  }
});

module.exports = mongoose.model("buy", buySchema);
