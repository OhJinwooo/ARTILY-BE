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
  refreshToken: {
    type: String,
  },
  // role: {
  //   type: Boolean,
  // },
  // refreshToken: {
  //   type: String,
  // },
  // profileUrl: {
  //   type: String,
  // },
  // address: {
  //   type: String,
  // },
  // blacklist: {
  //   type: Array,
  // },
  // profile: {
  //   type: String,
  // },
  // follow: {
  //   type: Array,
  // },
  // follower: {
  //   type: Array,
  // },
});
// UserSchema.virtual("userId").get(function () {
//   return this._id.toHexString();
// });
// UserSchema.set("toJSON", {
//   virtuals: true,
// });
module.exports = mongoose.model("User", UserSchema);

// const mongoose = require("mongoose");

// const userSchema = mongoose.Schema({
//   userId: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   password: {
//     type: String,
//   },
//   userName: {
//     type: String,
//   },
//   provider: {
//     type: String,
//   },
// });

// module.exports = mongoose.model("User", userSchema);
