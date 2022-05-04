const Review = require("../../schemas/review.schemas");
const Like = require("../../schemas/like.schemas");
const express = require("express");
const { create } = require("../../schemas/review.schemas");

// 좋아요
const like = async (req, res) => {
  const { reviewId } = req.params;
  const { user } = res.locals;
  const { userId } = user;
  console.log(userId);

  const existBoard = await Review.find({ _id: reviewId });
  console.log("existBoard", existBoard);
  let like = existBoard[0]["likeCnt"];
  console.log("likeCnt", like);

  await Review.updateOne({ _id: reviewId }, { $set: { likeCnt: like + 1 } });
  await Like.create({ userId, reviewId });

  res.send("좋아요 성공!");
};

// 아니좋아요~
const unlike = async (req, res) => {
  const { reviewId } = req.params;
  const { user } = res.locals;
  const { userId } = user;

  const existBoard = await Review.find({ _id: reviewId });
  console.log("existBoard", existBoard);
  let like = existBoard[0]["likeCnt"];
  console.log("likeCnt", like);

  await Review.updateOne({ _id: reviewId }, { $set: { likeCnt: like - 1 } });
  await Like.findOneAndDelete({ userId, reviewId }, { userId });

  res.send("좋아요 취소");
};

module.exports = {
  like,
  unlike,
};
