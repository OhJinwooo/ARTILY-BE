const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  reviewId: {
    type: String,
    required: true,
    unique: true,
  },
  category: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  nickname: {
    type: String,
    required: true,
  },
  reviewTitle: {
    type: String,
    required: true,
  },
  reviewContent: {
    type: String,
    required: true,
  },
  likeCnt: {
    type: Number,
    required: true,
  },
  imageUrl: {
    type: Array,
    required: true,
  },
});

// CommentSchema.virtual("commentid").get(function () {
//   return this._id.toHexString();
// });

// CommentSchema.set("toJSON", {
//   virtuals: true,
// });

module.exports = mongoose.model("comment", CommentSchema);
