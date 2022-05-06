const User = require("../../schemas/user.schemas");
const Post = require("../../schemas/post.schemas");
const s3 = require("../config/s3");

// 초반 프로필 설정
const postProfile = async (req, res) => {
  const { user } = res.locals;
  const userId = user.userId;

  const { introduce, nickname, snsUrl, address } = req.body;

  const profileImage = req.file?.location;
  // console.log("img", profileImage);

  // try {
  const photo = await User.findOne({ userId });
  console.log("photo", photo);
  const url = photo.profileImage.split("/");
  console.log("profileImage", profileImage);
  console.log("url", url);
  const delFileName = url[url.length - 1];
  // console.log("delFileName", delFileName);

  if (photo.profileImage) {
    console.log("이미지 있음");
    s3.deleteObject(
      {
        Bucket: "myawsbukets",
        Key: delFileName,
      },
      (err, data) => {
        if (err) {
          throw err;
        }
      }
    );
    console.log(123);
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
          type: "member",
        },
      }
    );
  } else {
    console.log("이미지 없음");
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
          type: "member",
        },
      }
    );
  }
  res.status(201).json({ success: true });
  // } catch (error) {
  //   res.status(400).send("작성 실패");
  // }
};

// 프로필 조회
const getProfile = async (req, res) => {
  console.log(123);
  const { userId } = res.locals.user;
  try {
    console.log("try");
    const myprofile = await User.findOne({ userId });
    // const mypost = myprofile.myPost;
    const mypost = ["4027f67fbadd", "47f17da48d40", "4084c11588a2"];
    const posts = await Post.find({ postId: mypost });
    console.log("더미", posts);
    const myPosts = {};
    let postId = "";
    let imageUrl = "";
    let postTitle = "";
    let done = "";
    for (let i = 0; i < posts.length; i++) {
      // myPosts = {
      postId = posts[i].postId;
      imageUrl = posts[i].imageUrl;
      postTitle = posts[i].postTitle;
      // price= posts[0].price;
      done = posts[i].done;
      // markupCnt= posts[i].markupCnt,
      // };
      console.log("for", { postId, imageUrl, postTitle, done });
    }
    console.log("out", postId, imageUrl, postTitle, done);
    // console.log(myPosts);

    const myProfiles = {
      myUserId: myprofile.userId,
      //mynickname : myprofile.nickname;
      mynickname: 1,
      //myProfileImage : myprofile.profileImage;
      myProfileImage: 2,
      //myInrtoduce : myprofile.introduce;
      myInrtoduce: 3,
      myFollowCnt: myprofile.followCnt,
      myFollowerCnt: myprofile.followerCnt,
      myFollow: myprofile.follow,
      myFollower: myprofile.follower,
      myPost: myprofile.myPost,
      myMarkup: myprofile.myMarkup,
      myReview: myprofile.myReview,
      myBuy: myprofile.myBuy,
      mySnsUrl: myprofile.snsUrl,
    };
    // console.log(123, myProfiles);

    res.status(200).json({ myProfiles });
  } catch (err) {
    res.send(err);
  }
};

// 프로필 수정
const updateProfile = async (req, res) => {
  console.log(123123);
  const { user } = res.locals;
  const { nickname, address, introduce, snsUrl } = req.body;
  const userId = user.userId;
  console.log(userId);
  const profileImage = req.file?.location;
  console.log("12312", profileImage);

  try {
    if (profileImage) {
      s3.deleteObject(
        {
          Bucket: "myawsbucket",
          // Key: delFile
        },
        (err, data) => {
          if (err) {
            throw err;
          }
        }
      );
      await User.updateOne({ userId }, { $set: { profileImage } });
    } else {
      const photo = await User.find({ userId });
      const profileImage = photo[0].profileImage;
      await User.updateOne(
        {
          userId,
        },
        {
          $set: {
            nickname,
            address,
            introduce,
            profileImage,
            snsUrl,
          },
        }
      );
      res.status(201).json({ success: true });
    }
  } catch (error) {
    res.sattus(400).send("수정 실패");
  }
};

module.exports = {
  postProfile,
  getProfile,
  updateProfile,
};
