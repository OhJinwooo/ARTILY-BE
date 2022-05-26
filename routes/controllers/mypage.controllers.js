require("dotenv").config();
const User = require("../../schemas/user.schemas");
const Post = require("../../schemas/post.schemas");
const Review = require("../../schemas/review.schemas");
const Markup = require("../../schemas/markUp.schemas");
const PostImage = require("../../schemas/postImage.schemas");
const ReviewImage = require("../../schemas/reviewImage.schemas");
const Buy = require("../../schemas/buy.schemas");
const Follow = require("../../schemas/follow.schemas");
const ChatData = require("../../schemas/chatData.schemas");
const s3 = require("../config/s3");

// 초반 프로필 설정
const postProfile = async (req, res) => {
  const { userId } = res.locals.user;

  const { introduce, snsUrl, address, nickname } = req.body;
  const profileImage = req.file?.location;

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
          type: "member",
        },
      }
    );
    res.status(201).json({ success: true });
  } catch (error) {
    res.status(400).send("작성 실패");
  }
};

// 상대 프로필 조회
const getProfile = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findOne(
      { userId },
      "userId nickname profileImage introduce followCnt followerCnt snsUrl"
    );
    if (!user) {
      return res.send({ msg: "유저 정보가 올바르지 않습니다." });
    }

    const myPosts = await Post.find(
      { "user.userId": userId },
      "postId imageUrl postTitle price done markupCnt"
    );
    const postCnt = myPosts.length;

    if (myPosts.length) {
      for (let myPost of myPosts) {
        const images = await PostImage.findOne({ postId: myPost.postId });
        myPost.images = images;
        if (myPost.images === null) {
          myPost.images = [""];
        }
      }
    }

    const myReviews = await Review.find(
      { userId },
      "reviewId nickname profileImage reviewTitle reviewContent imageUrl likeCnt"
    );
    if (myReviews.length) {
      for (let myReview of myReviews) {
        //myPost는 myPosts안에 있는 인덱스중 하나
        const images = await ReviewImage.findOne({
          reviewId: myReview.reviewId,
        });
        myReview.images = images;
        if (myReview.images === null) {
          myReview.images = [""];
        }
      }
    }
    const markUpPost = await Markup.find({ userId }, "postId");
    let myMarkups = [];
    let myMarkup = [];
    if (markUpPost.length) {
      for (let i = 0; i < markUpPost.length; i++) {
        myMarkup.push(markUpPost[i].postId);
      }

      myMarkups = await Post.find(
        { postId: myMarkup },
        "postId imageUrl postTitle price done markupCnt"
      );

      for (let markUp of myMarkups) {
        //myPost는 myPosts안에 있는 인덱스중 하나
        let images = await PostImage.findOne({ postId: markUp.postId });
        markUp.images = images;
        if (markUp.images === null) {
          markUp.images = [""];
        }
      }
    }
    res.status(200).json({ user, postCnt, myPosts, myReviews, myMarkups });
  } catch (err) {
    res.send(err);
  }
};

// 내 프로필 조회
const myProfile = async (req, res) => {
  const { userId } = res.locals.user;
  console.log("userId", userId);

  try {
    const user = await User.findOne(
      { userId },
      "userId nickname profileImage introduce followCnt followerCnt snsUrl"
    );
    if (!user) {
      return res.send({ msg: "로그인 후 이용하세요." });
    }

    const myPosts = await Post.find(
      { "user.userId": userId },
      "postId imageUrl postTitle price done markupCnt"
    );
    const postCnt = myPosts.length;

    if (myPosts.length) {
      for (let myPost of myPosts) {
        const images = await PostImage.findOne({ postId: myPost.postId });
        myPost.images = images;
        if (myPost.images === null) {
          myPost.images = [""];
        }
      }
    }

    const myReviews = await Review.find(
      { userId },
      "reviewId nickname profileImage reviewTitle reviewContent imageUrl likeCnt"
    );
    if (myReviews.length) {
      for (let myReview of myReviews) {
        //myPost는 myPosts안에 있는 인덱스중 하나
        const images = await ReviewImage.findOne({
          reviewId: myReview.reviewId,
        });
        myReview.images = images;
        if (myReview.images === null) {
          myReview.images = [""];
        }
      }
    }

    const markUpPost = await Markup.find({ userId }, "postId");
    let myMarkups = [];
    let myMarkup = [];
    if (markUpPost.length) {
      for (let i = 0; i < markUpPost.length; i++) {
        myMarkup.push(markUpPost[i].postId);
      }

      myMarkups = await Post.find(
        { postId: myMarkup },
        "postId imageUrl postTitle price done markupCnt"
      );

      for (let markUp of myMarkups) {
        //myPost는 myPosts안에 있는 인덱스중 하나
        let images = await PostImage.findOne({ postId: markUp.postId });
        markUp.images = images;
        if (markUp.images === null) {
          markUp.images = [""];
        }
      }
    }
    console.log("마지막", myPosts);
    res.status(200).json({ user, postCnt, myPosts, myReviews, myMarkups });
  } catch (err) {
    res.send(err);
  }
};

// 프로필 수정
const updateProfile = async (req, res) => {
  const { userId } = res.locals.user;
  const { introduce, snsUrl, address, nickname } = req.body;
  let profileImage = req.file?.location;

  try {
    const photo = await User.findOne({ userId });
    if (photo.profileImage) {
      const url = photo.profileImage.split("/");
      const delFileName = url[url.length - 1];

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
            "user.address": address,
            "user.introduce": introduce,
            "user.snsUrl": snsUrl,
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

      await Follow.updateOne(
        {
          followId: userId,
        },
        {
          $set: {
            profileImage,
          },
        }
      );

      await ChatData.updateOne(
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
            "user.address": address,
            "user.introduce": introduce,
            "user.snsUrl": snsUrl,
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
      await Follow.updateOne(
        {
          followId: userId,
        },
        {
          $set: {
            profileImage,
          },
        }
      );

      await ChatData.updateOne(
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
    const { userId } = res.locals.user;
    const myPosts = await Post.find(
      { "user.userId": userId },
      "postId postTitle price done imageUrl markupCnt"
    );
    if (myPosts.length > 0) {
      for (let myPost of myPosts) {
        const images = await PostImage.findOne({ postId: myPost.postId });
        myPost.images = images;
        if (myPost.images === null) {
          myPost.images = [""];
        }
      }
      res.status(200).json({ myPosts });
    }
  } catch (err) {
    res.status(400).send("조회 실패");
  }
};

//내가 구입한 상품
const getMyBuy = async (req, res) => {
  try {
    const { userId } = res.locals.user;
    console.log("userId", userId);
    const buyPost = await Buy.find({ userId }, "postId");
    let mybuy = [];
    for (let i = 0; i < buyPost.length; i++) {
      mybuy.push(buyPost[i].postId);
    }
    const myBuy = await Post.find(
      { postId: mybuy },
      "postId postTitle user.nickname images"
    );
    console.log("myBuy", myBuy);
    if (myBuy.length > 0) {
      for (let myPost of myBuy) {
        const images = await PostImage.findOne({ postId: myPost.postId });
        myPost.images = images;
        if (myPost.images === null) {
          myPost.images = [""];
        }
      }
      res.status(200).json({ myBuy });
    } else {
      res.status(200).json({ msg: "구매한 작품이 없습니다." });
    }
  } catch (err) {
    res.status(400).send("조회 실패");
  }
};

module.exports = {
  postProfile,
  getProfile,
  myProfile,
  updateProfile,
  getMyPost,
  getMyBuy,
};
