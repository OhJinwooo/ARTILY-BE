const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  comment: String,
  postid: String,
  userId: String,
  nickname: String,

});

CommentSchema.virtual("commentid").get(function () {
  return this._id.toHexString();
});

CommentSchema.set("toJSON", {
  virtuals: true,
});

module.exports = mongoose.model("comment", CommentSchema);