const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  category: {
    type: String,
    // required: true,
  },
  userId: {
    type: String,
    // required: true,
  },
  nickname: {
    type: String,
    //   required: true,
  },
  reviewId: {
    type: String,
    //  required: true,
  },
  reviewTitle: {
    type: String,
    //  required: true,
  },
  reviewContent: {
    type: String,
    //  required: true,
  },
  likeCnt: {
    type: Number,
    default: 0,
  },
  imageUrl: {
    type: Array,
    //   required: true,
  },
  createdAt: {
    type: String,
    //   required: true,
  },
});

// ReviewSchema.virtual("reviewId").get(function () {
//   return this._id.toHexString();
// });

ReviewSchema.set("toJSON", {
  virtuals: true,
});

module.exports = mongoose.model("Review", ReviewSchema);
