const BlackList = require("../../schemas/blackList.schemas");

// 신고하기
const blackList = async (req, res) => {
  const { ReviewUserId } = req.params; //
  const { user } = res.locals;
  const { userId } = user;

  //이미 신고한 유저인지 확인
  const blackListCheck = await BlackList.findOne({
    userId,
    blackList: ReviewUserId,
  });

  //신고했던 유저가 아니라면 블랙리스트db에 저장
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
