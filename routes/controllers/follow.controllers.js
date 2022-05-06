const User = require("../../schemas/user.schemas");

//follow
const addfollow = async (req, res) => {
  //내가 팔로우 하려는 유저
  const followUser = req.params;
  const followUserId = followUser.followUser;
  console.log("123123", followUserId);
  //내 유저 아이디
  const { user } = res.locals;
  const { userId } = user;
  console.log("userId", userId);

  //DB에 저장된 내user정보 가져오기
  const myFollow = await User.findOne({ userId }).exec();
  // console.log("myFollow", myFollow);
  const found = await User.find({ follow: followUserId });
  //DB에 저장된 상대user정보 가져오기
  const follower = await User.findOne({ userId: followUserId }).exec();
  // console.log("follower", follower);

  try {
    if (!found.length) {
      await myFollow.updateOne({ $push: { follow: followUserId } });
      await myFollow.updateOne({ $inc: { followCnt: 1 } });
      await follower.updateOne({ $push: { follower: userId } });
      await follower.updateOne({ $inc: { followerCnt: 1 } });
      // console.log("push", myFollow, follower);
      // res.send({});
    } else {
      await myFollow.updateOne({ $pull: { follow: followUserId } });
      await myFollow.updateOne({ $inc: { followCnt: -1 } });
      await follower.updateOne({ $pull: { follower: userId } });
      await follower.updateOne({ $inc: { followerCnt: -1 } });
      // console.log("pull", myFollow, follower);
      // res.send({});
    }
    // 내가 팔로우한 최신 목록 조회
    const newfollows = await User.findOne({ userId });
    const follows = newfollows.follow;

    // 내 팔로워 최신 목록 조회
    const newfollowers = await User.findOne({ userId });
    const followers = newfollows.follower;

    // 팔로우 당한 사람의 최신 목록 조회
    // const newfollowers = await User.findOne({ userId: followUserId });
    // const followers = newfollowers.follower;

    console.log("new", newfollows, newfollowers);
    res.json({ follows, followers });
  } catch {
    res.send("Error");
  }
};

module.exports = {
  addfollow,
};
