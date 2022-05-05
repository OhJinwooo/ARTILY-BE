const mongoose = require("mongoose");

const followSchema = new mongoose.Schema({
  myuserId: {
    type: String,
  },
  followId: {
    type: Array,
  },
});

module.exports = mongoose.model("follow", followSchema);
