const mongoose = require("mongoose");

const reviewImageSchema = new mongoose.Schema({
  reviewId: {
    type: String,
  },
  imageId: {
    type: String,
  },
  imageUrl: {
    type: String,
  },
});

module.exports = mongoose.model("reviewImage", reviewImageSchema);
