const User = require("../../schemas/user.schemas");

//follow
const addfollow = async (req, res) => {
  try {
    //내가 팔로우 하려는 유저
    const followId = req.params;
    const followUserId = followId.followId;
    //내 유저 아이디
    const { user } = res.locals;
    const { userId } = user;

    //DB에 저장된 내user정보 가져오기
    const myFollow = await User.findOne({ userId }).exec();
    // console.log("myFollow", myFollow);
    const found = await User.find({ follow: followUserId });
    //DB에 저장된 상대user정보 가져오기
    const follower = await User.findOne({ userId: followUserId }).exec();
    // console.log("follower", follower);

    if (!found.length) {
      await myFollow.updateOne({ $push: { follow: followUserId } });
      await myFollow.updateOne({ $inc: { followCnt: 1 } });
      await follower.updateOne({ $push: { follower: userId } });
      await follower.updateOne({ $inc: { followerCnt: 1 } });

      res.status(200).json({ respons: "success", msg: "팔로잉" });
    } else {
      await myFollow.updateOne({ $pull: { follow: followUserId } });
      await myFollow.updateOne({ $inc: { followCnt: -1 } });
      await follower.updateOne({ $pull: { follower: userId } });
      await follower.updateOne({ $inc: { followerCnt: -1 } });

      res.status(200).json({ respons: "success", msg: "팔로우 취소" });
    }
    // res.status(200).json({ success: true });
  } catch {
    res.status(400).send("Error");
  }
};

//내 팔로우 리스트 조회
const getFollow = async (req, res) => {
  try {
    const { userId } = res.locals.user;
    const follow = await User.findOne({ userId });
    const followId = follow.follow;

    let followList = [];
    const followlist = await User.find({ userId: followId });
    for (let i = 0; i < followlist.length; i++) {
      followList.push(followlist[i].nickname);
    }
    res.status(200).json({ followList });
  } catch (err) {
    res.status(400).send("팔로우 목록 조회 실패");
  }
};

//내 팔로워 리스트 조회
const getFollower = async (req, res) => {
  try {
    const { userId } = res.locals.user;
    const follow = await User.findOne({ userId });
    const followId = follow.follower;

    let followerList = [];
    const followerlist = await User.find({ userId: followId });
    for (let i = 0; i < followerlist.length; i++) {
      followerList.push(followerlist[i].nickname);
    }
    res.status(200).json({ followerList });
  } catch (err) {
    res.status(400).send("팔로우 목록 조회 실패");
  }
};

module.exports = {
  addfollow,
  getFollow,
  getFollower,
};
