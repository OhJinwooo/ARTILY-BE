const BlackList = require("../../schemas/blackList.schemas");

// 신고하기
const blackList = async (req, res) => {
  const { ReviewUserId } = req.params; //
  console.log("A", ReviewUserId);
  const { user } = res.locals;
  const { userId } = user;
  console.log("B", userId);

  const blackListCheck = await BlackList.findOne({
    userId,
    blackList: ReviewUserId,
  });
  console.log("블랙리스트", blackListCheck);

  if (!blackListCheck) {
    await BlackList.create({ userId, blackList: ReviewUserId });
  } else {
    res.status(401).send({ errorMessage: "이미 신고되어있습니다!" });
    return;
  }
  res.json("해당유저가 신고되었습니다.");
};

module.exports = {
  blackList,
};
