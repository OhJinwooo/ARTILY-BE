const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  nickname: {
    type: String,
    required: true,
  },
  provider: {
    type: String,
  },
  profileUrl: {
    type: String,
  },
  profile: {
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
  inquiry: {
    type: String,
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
