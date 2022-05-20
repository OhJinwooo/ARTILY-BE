const mongoose = require("mongoose");

const BlackListSchema = new mongoose.Schema({
  userId: {
    type: String,
  },
  blackList: {
    type: String,
  },
});
module.exports = mongoose.model("BlackList", BlackListSchema);
