require("dotenv").config();
const User = require("../../schemas/user.schemas");
const Post = require("../../schemas/post.schemas");
const Review = require("../../schemas/review.schemas");
const s3 = require("../config/s3");

// 초반 프로필 설정
const postProfile = async (req, res) => {
  const { user } = res.locals;
  const userId = user.userId;

  const { introduce, snsUrl, address, nickname } = req.body;

  const profileImage = req.file?.location;

  console.log("img", profileImage);

  try {
    const photo = await User.findOne({ userId });
    // console.log("photo", photo);
    const url = photo.profileImage.split("/");
    console.log("profileImage", profileImage);
    console.log("url", url);
    const delFileName = url[url.length - 1];
    // console.log("delFileName", delFileName);

    if (photo.profileImage) {
      console.log("이미지 있음");
      s3.deleteObject(
        {
          Bucket: process.env.BUCKETNAME,
          Key: delFileName,
        },
        (err, data) => {
          if (err) {
            throw err;
          }
        }
      );
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
  } catch (error) {
    res.status(400).send("작성 실패");
  }
};

// 프로필 조회
const getProfile = async (req, res) => {
  const { userId } = req.params;
  console.log(res.locals.user);
  try {
    const myprofile = await User.findOne(
      { userId },
      "userId nickname profileImage introduce followCnt followerCnt follow follower myPost myMarkup myReview myBuy snsUrl"
    );
    console.log(myprofile);
    const mypost = myprofile.myPost;
    const myPost = await Post.find(
      { postId: mypost },
      "postId imageUrl postTitle price done markupCnt"
    );
    const myreview = myprofile.myReview;
    const myReview = await Review.find(
      { reviewId: myreview },
      "reviewId nickname profileImage reviewTitle reviewContent imageUrl likeCnt"
    );

    const mymarkup = myprofile.myMarkup;
    const myMarkup = await Post.find(
      { postId: mymarkup },
      "postId imageUrl postTitle price done markupCnt"
    );

    res.status(200).json({ myprofile, myPost, myReview, myMarkup });
  } catch (err) {
    res.send(err);
  }
};

// 프로필 수정
const updateProfile = async (req, res) => {
  const { user } = res.locals;
  const userId = user.userId;
  const { introduce, snsUrl, address, nickname } = req.body;
  const profileImage = req.file?.location;

  try {
    const photo = await User.findOne({ userId });
    const url = photo.profileImage.split("/");
    const delFileName = url[url.length - 1];

    if (photo.profileImage) {
      console.log("이미지 있음");
      s3.deleteObject(
        {
          Bucket: process.env.BUCKETNAME,
          Key: delFileName,
        },
        (err, data) => {
          if (err) {
            throw err;
          }
        }
      );
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
      await Post.updateMany(
        {
          "user.userId": userId,
        },
        {
          $set: {
            "user.nickname": nickname,
            "user.profileImage": profileImage,
          },
        }
      );

      await Review.updateOne(
        {
          userId,
        },
        {
          $set: {
            nickname,
            profileImage,
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
          },
        }
      );
      await Post.updateMany(
        {
          "user.userId": userId,
        },
        {
          $set: {
            "user.nickname": nickname,
            "user.profileImage": profileImage,
          },
        }
      );

      await Review.updateOne(
        {
          userId,
        },
        {
          $set: {
            nickname,
            profileImage,
          },
        }
      );
    }
    res.status(201).json({ success: true });
  } catch (error) {
    res.status(400).send("프로필 수정 실패");
  }
};

//판매 작품 관리하기
const getMyPost = async (req, res) => {
  try {
    console.log(123123123);
    const { userId } = res.locals.user;
    const mypost = await User.findOne({ userId });
    const Mypost = mypost.myPost;
    const myPost = await Post.find(
      { postId: Mypost },
      "postId postTitle price done imageUrl markupCnt"
    );
    console.log("mypost", myPost);
    res.status(200).json({ myPost });
  } catch (err) {
    res.status(400).send("조회 실패");
  }
};

//내가 구입한 상품
const getMyBuy = async (req, res) => {
  try {
    const { user } = res.locals;
    // console.log(user);
    const userId = user.userId;
    const mybuy = await User.find({ userId });
    const Mybuy = mybuy.myBuy;

    // const mybuy = ["4027f67fbadd", "47f17da48d40", "4084c11588a2"];
    const myBuy = await Post.find(
      { postId: Mybuy },
      "postId postTitle user.nickname imageUrl"
    );
    console.log("myBuy", myBuy);
    res.status(200).json({ myBuy });
  } catch (err) {
    res.status(400).send("조회 실패");
  }
};

module.exports = {
  postProfile,
  getProfile,
  updateProfile,
  getMyPost,
  getMyBuy,
};

// console.log(123123);
// const { user } = res.locals;
// const { nickname, address, introduce, snsUrl } = req.body;
// const userId = user.userId;
// console.log(userId);
// const profileImage = req.file?.location;
// console.log("12312", profileImage);

// try {
//   if (profileImage) {
//     s3.deleteObject(
//       {
//         Bucket: "myawsbucket",
//         // Key: delFile
//       },
//       (err, data) => {
//         if (err) {
//           throw err;
//         }
//       }
//     );
//     await User.updateOne({ userId }, { $set: { profileImage } });
//   } else {
//     const photo = await User.find({ userId });
//     const profileImage = photo[0].profileImage;
//     await User.updateOne(
//       {
//         userId,
//       },
//       {
//         $set: {
//           nickname,
//           address,
//           introduce,
//           profileImage,
//           snsUrl,
//         },
//       }
//     );
//     res.status(201).json({ success: true });
//   }
// } catch (error) {
//   res.sattus(400).send("수정 실패");
// }
// };
