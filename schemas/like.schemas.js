const mongoose = require("mongoose");

const likesSchema = new mongoose.Schema({
  userId: {
    type: String,
  },
  reviewId: {
    type: String,
  },
});

module.exports = mongoose.model("Like", likesSchema);
