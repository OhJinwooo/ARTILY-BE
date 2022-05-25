const mongoose = require("mongoose");

const buySchema = new mongoose.Schema({
  userId: {
    type: String,
  },
  postId: {
    type: String,
  },
  postTitle: {
    type: String,
  },
  category: {
    type: String,
  },
  price: {
    type: String,
  },
  user : {
    type:Array
  },
  images : {
    type:String
  },
  createdAt:{
    type: String
  }
});

module.exports = mongoose.model("buy", buySchema);
