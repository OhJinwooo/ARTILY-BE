const mongoose = require("mongoose");

const buySchema = new mongoose.Schema({
  userId: {
    type: String,
  },
  postId: {
    type: String,
  },
});

module.exports = mongoose.model("buy", buySchema);
