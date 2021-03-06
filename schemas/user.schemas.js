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
  followCnt: {
    type: Number,
    default: 0,
  },
  followerCnt: {
    type: Number,
    default: 0,
  },
  snsUrl: {
    type: Array,
  },
  type: {
    type: String,
  },
});
module.exports = mongoose.model("User", UserSchema);
