const User = require("../../schemas/user.schemas");
const express = require("express");
const { create } = require("../../schemas/review.schemas");

// 신고하기
const blackList = async (req, res) => {
  const { ReviewUserId } = req.params; //
  console.log(ReviewUserId);
  const { user } = res.locals;
  const { userId } = user;
  console.log(userId);

  const blackListCheck = await User.find({ blacklist: ReviewUserId });
  //console.log("블랙리스트", blackListCheck[0].blacklist);

  if (!blackListCheck.length) {
    await User.updateOne({ userId }, { $push: { blacklist: ReviewUserId } });
  } else {
    res.status(401).send({ errorMessage: "이미 신고되어있습니다!" });
    return;
  }
  res.send("해당유저가 신고되었습니다.");
};

module.exports = {
  blackList,
};
