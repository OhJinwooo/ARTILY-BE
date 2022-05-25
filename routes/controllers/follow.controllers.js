const User = require("../../schemas/user.schemas");
const Follow = require("../../schemas/follow.schemas");

//follow
const addfollow = async (req, res) => {
  try {
    //내가 팔로우 하려는 유저
    const { followId } = req.params;
    //내 유저 아이디
    const { userId } = res.locals.user;
    //follow DB에 본인이 팔로우한 유저정보가 있는지
    const found = await Follow.findOne({ userId, followId });
    const myFollow = await User.findOne({ userId });
    const followUser = await User.findOne({ userId: followId });
    const followName = followUser.nickname;

    const profileImage = followUser.profileImage;
    if (!found) {
      //팔로우 하려는 유저 정보 저장
      const follow = await Follow.create({
        userId,
        followId,
        followName,
        profileImage,
      });
      console.log('follow',follow)
      await myFollow.updateOne({ $inc: { followCnt: 1 } });
      await followUser.updateOne({ $inc: { followerCnt: 1 } });

      res.send({ success: true, msg: "팔로잉" });
    } else {
      const follow = await Follow.deleteOne({ userId, followId });
      await myFollow.updateOne({ $inc: { followCnt: -1 } });
      await followUser.updateOne({ $inc: { followerCnt: -1 } });
      res.send({ success: true, msg: "팔로우 취소" });
    }
  } catch {
    res.status(400).send("Error");
  }
};

//내 팔로잉 리스트 조회
const myFollow = async (req, res) => {
  try {
    const { userId } = res.locals.user;
    const follow = await Follow.find(
      { userId },
      "followId followName profileImage"
    );

    res.status(200).json({ success: true, data: follow });
  } catch (err) {
    res.status(400).send("팔로우 목록 조회 실패");
  }
};

//내 팔로워 리스트 조회
const myFollower = async (req, res) => {
  try {
    const { userId } = res.locals.user;
    const follow = await Follow.find({ followId: userId }, "userId");
    followerlist = [];
    for (let i = 0; i < follow.length; i++) {
      followerlist.push(follow[i].userId);
    }
    const follower = await User.find(
      { userId: followerlist },
      "userId nickname profileImage"
    );

    res.status(200).json({ success: true, data: follower });
  } catch (err) {
    res.status(400).send("팔로우 목록 조회 실패");
  }
};

//다른 유저 팔로잉 리스트 조회
const follow = async (req, res) => {
  try {
    const { userId } = req.params;
    const follow = await Follow.find(
      { userId },
      "followId followName profileImage"
    );

    res.status(200).json({ success: true, data: follow });
  } catch (err) {
    res.status(400).send("팔로우 목록 조회 실패");
  }
};

//다른 유저 팔로워 리스트 조회
const follower = async (req, res) => {
  try {
    const { userId } = req.params;
    const follow = await Follow.find({ followId: userId }, "userId");
    followerlist = [];
    for (let i = 0; i < follow.length; i++) {
      followerlist.push(follow[i].userId);
    }
    const follower = await User.find(
      { userId: followerlist },
      "userId nickname profileImage"
    );

    res.status(200).json({ success: true, data: follower });
  } catch (err) {
    res.status(400).send("팔로우 목록 조회 실패");
  }
};

//팔로워 삭제
const deleteFollower = async (req, res) => {
  try {
    const { userId } = req.params;
    const myId = res.locals.user.userId;
    const followers = await Follow.findOne({ userId, followId: myId });
    console.log(followers);
    if (followers) {
      await Follow.deleteOne({ userId, followId: myId });
      await User.updateOne({ userId }, { $inc: { followCnt: -1 } });
      await User.updateOne({ userId: myId }, { $inc: { followerCnt: -1 } });
      return res.status(200).json({ success: true, msg: "삭제완료" });
    } else {
      return res.status(400).send({ msg: "이미 삭제되었습니다." });
    }
  } catch (err) {
    res.status(400).send("팔로워 삭제 실패");
  }
};

module.exports = {
  addfollow,
  follow,
  follower,
  myFollow,
  myFollower,
  deleteFollower,
};
