const mongoose = require("mongoose");

const postImageSchema = new mongoose.Schema({
  postId: {
    type: String,
  },
  imageId: {
    type: String,
  },
  imageNumber: {
    type: Number,
  },
  imageUrl: {
    type: String,
  },
});

module.exports = mongoose.model("postImage", postImageSchema);
