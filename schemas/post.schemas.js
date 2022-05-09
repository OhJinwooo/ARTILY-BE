const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  postId: {
    type: String,
    unique: true,
  },
  postTitle: {
    type: String,
  },
  postContent: {
    type: String,
  },
  createdAt: {
    type: String,
  },
  category: {
    type: String,
  },
  transaction: {
    type: String,
  },
  price: {
    type: String,
  },
  postSize: {
    type: String,
  },
  user: {
    type: Object,
  },
  changeAddress: {
    type: String,
  },
  imageUrl: {
    type: Array,
  },
  done: {
    type: String,
  },
  markupCnt: {
    type: Number,
  },
});

//몽고디비 고유의 id값을 가져오는 코드
/* postSchema.virtual("postid").get(function () {
  //몽고디비에서 이렇게 사용해라! 라고 만든 것이기 때문에 임의로 변경해서는 안된다
  return this._id.toHexString();
}); */
/* postSchema.set("toJSON", {
  virtuals: true,
}); */

module.exports = mongoose.model("Post", postSchema);
