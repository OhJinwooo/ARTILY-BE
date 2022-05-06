const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  nickname: {
    type: String,
  },
  provider: {
    type: String,
  },
  profileImage: {
    type: String,
  },
  introduce: {
    type: String,
  },
  refreshToken: {
    type: String,
  },
  role: {
    type: Boolean,
  },
  address: {
    type: String,
  },
  blacklist: {
    type: Array,
  },
  followCnt: {
    type: Number,
    default: 0,
  },
  followerCnt: {
    type: Number,
    default: 0,
  },
  follow: {
    type: Array,
  },
  follower: {
    type: Array,
  },
  myPost: {
    type: Array,
  },
  myReview: {
    type: Array,
  },
  myMarkup: {
    type: Array,
  },
  myBuy: {
    type: Array,
  },
  snsUrl: {
    type: Array,
  },
});
// UserSchema.virtual("userId").get(function () {
//   return this._id.toHexString();
// });
// UserSchema.set("toJSON", {
//   virtuals: true,
// });
module.exports = mongoose.model("User", UserSchema);
