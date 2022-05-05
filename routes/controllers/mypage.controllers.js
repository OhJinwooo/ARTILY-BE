const User = require("../../schemas/user.schemas");

// 초반 프로필 설정
const postProfile = async (req, res) => {
  const { user } = res.locals;
  const { profileImage, introduce, nickname, snsUrl } = req.body;
  const userId = user.userId;

  try {
    await User.updateOne(
      {
        userId,
      },
      {
        $set: {
          nickname,
          profileImage,
          address,
          introduce,
          snsUrl,
        },
      }
    );
    res.status(201).json({ success: true });
  } catch (error) {
    res.sattus(400).send("작성 실패");
  }
};

// 프로필 조회
const getProfile = async (req, res) => {
  const userId = res.locals.user;
  try {
    const myprofile = await User.findOne({ userId });
    console.log(myprofile);

    res.status(200).json({ myprofile });
  } catch (err) {
    res.send(err);
  }
};

// 프로필 수정
const updateProfile = async (req, res) => {
  const { user } = res.locals;
  const { nickname, profileImage, address, introduce, snsUrl } = req.body;
  const userId = user.userId;

  try {
    await User.updateOne(
      {
        userId,
      },
      {
        $set: {
          nickname,
          profileImage,
          address,
          introduce,
          snsUrl,
        },
      }
    );
    res.status(201).json({ success: true });
  } catch (error) {
    res.sattus(400).send("수정 실패");
  }
};

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

  // try {
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

  // } catch {
  //   res.send("에러");
  // }
};

// // follow 취소
// const unfollow = async (req, res) => {
//   const { userId } = req.params;
//   const { user } = res.locals;
//   const myuserId = user.userId;

//   const existFollow = await User.find({ userId: myuserId });
//   console.log(11, existFollow);
//   // let follow = existFollow[0]["followCnt"];
//   // console.log("follow", follow);

//   // const b = await User.updateOne(
//   //   { userId: myuserId },
//   //   { $inc: { followCnt: -1 } }
//   // );
//   // await Follow.findOneAndDelete(
//   //   { followId: userId, myuserId },
//   //   { followId: userId }
//   // );
//   // const a = await Follow.find({});

//   // console.log(22, existFollow);
//   // console.log(33, a.length);

//   // res.send({});
// };

module.exports = {
  postProfile,
  getProfile,
  updateProfile,
  addfollow,
};

// 팔로우
// router.post("/follow", authMiddleware, async (req, res) => {
//   const { user } = res.locals;
//   const { userId } = user;
//   const { followUser } = req.body;
//   const followCheck = await User.find({ userId });
//   console.log("aaaaaaa", followCheck);
//   const followList = followCheck[0].follow;
//   console.log("팔로우 리스트-------->", followList);
//   if (!followList.length) {
//     await User.updateOne({ userId }, { $push: { follow: followUser } });
//     await User.updateOne(
//       { userId: followUser },
//       { $push: { follower: userId } }
//     );
//   } else {
//     for (let i = 0; i < followList.length; i++) {
//       if (followList[i] != followUser) {
//         await User.updateOne({ userId }, { $push: { follow: followUser } });
//         await User.updateOne(
//           { userId: followUser },
//           { $push: { follower: userId } }
//         );
//       } else {
//         res.status(401).send({ errorMessage: "이미 팔로우 되어있습니다!" });
//         return;
//       }
//     }
//   }
//   res.status(203).send({ msg: "ㅊㅋㅊㅋ" });
// });
