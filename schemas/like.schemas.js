const mongoose = require("mongoose");

const LikeSchema = new mongoose.Schema({
  userId: {
    type: String,
  },
  reviewId: {
    type: String,
  },
});

module.exports = mongoose.model("Like", LikeSchema);
