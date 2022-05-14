const mongoose = require("mongoose");

const followSchema = new mongoose.Schema({
  userId: {
    type: String,
  },
  followId: {
    type: String,
  },
  followName: {
    type: String,
  },
  profileImage: {
    type: String,
  },
});

module.exports = mongoose.model("follow", followSchema);
