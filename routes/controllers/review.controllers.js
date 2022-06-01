require("dotenv").config();
const Review = require("../../schemas/review.schemas");
const ReviewImages = require("../../schemas/reviewImage.schemas");
const Post = require("../../schemas/post.schemas");
const PostImages = require("../../schemas/postImage.schemas");
const {logger,stream}  =require('../../middleware/logger');
const Buy = require("../../schemas/buy.schemas");
const moment = require("moment");
const Joi = require("joi");
const reviewSchema = Joi.object({
  reviewTitle: Joi.string(),
  reviewContent: Joi.string().min(3).max(300),
});
const s3 = require("../config/s3");
const { v4 } = require("uuid");
const uuid = () => {
  const tokens = v4().split("-");
  return tokens[2] + tokens[1] + tokens[3];
};

// 리뷰 조회(무한 스크롤)
const review = async (req, res) => {
  try {
    // const data = req.query;
    // console.log("page", data.page);
    // console.log("limit", data.limit);
    // // infinite scroll 핸들링
    // // 변수 선언 값이 정수로 표현
    // let page = Math.max(1, parseInt(data.page));
    // let limit = Math.max(1, parseInt(data.limit));
    // // NaN일때 값지정
    // page = !isNaN(page) ? page : 1;
    // limit = !isNaN(limit) ? limit : 6;
    // // 제외할 데이터 지정 == 다음 페이지 시작점
    // let skip = (page - 1) * limit;

    // const reviews = await Review.find(
    //   {},
    //   "createdAt reviewId nickname profileImage reviewTitle reviewContent images likeCnt seller.category"
    // )
    //   .sort("-createdAt")
    //   .skip(skip)
    //   .limit(limit);

    const reviews = await Review.find({}).sort("-createdAt");
    if (reviews.length) {
      for (let review of reviews) {
        const imgs = await ReviewImages.findOne({
          reviewId: review.reviewId,
        });
        review.images = imgs;
      }
    }
    res.json({ reviews });
  } catch (err) {
    logger.error('reviews')
    console.error(err);
    next(err);
  }
};

// 리뷰 상세조회
const review_detail = async (req, res) => {
  try {
    const { reviewId } = req.params;

    //buyer & seller
    //리뷰를 작성한 user 정보 & 구매한 작품/작가 정보 찾기
    let buyer = await Review.find({ reviewId });
    let s_userId = "";
    if (buyer.length) {
      for (let review of buyer) {
        const imgs = await ReviewImages.find({ reviewId: review.reviewId });
        review.images = imgs;
      }
      s_userId = buyer[0].seller.user.userId;

      //defferents
      //내가 구매한 작가의 다른 작품들 찾기
      let defferents = await Post.find(
        { "user.userId": s_userId },
        "postId postTitle price"
      );

      // 판매자의 물품들(postId)
      if (defferents) {
        let seller_postId = [];
        for (let i = 0; i < defferents.length; i++) {
          seller_postId.push(defferents[i].postId);
        }

        //상단에 노출된 물품은 제외하고 추출
        filtering = seller_postId.filter((qq) => qq !== buyer[0].seller.postId);

        //필터링된 판매물품 정보
        let defferentInfo = await Post.find(
          { postId: filtering },
          "postId postTitle price imageUrl"
        );

        //판매물품들 정보에 이미지 합치기
        for (let info of defferentInfo) {
          const imgs = await PostImages.findOne({ postId: info.postId });
          info.images = imgs;
        }
        res.json({ buyer, defferentInfo });
      } else {
        res.json({ buyer });
      }
    } else {
      return res.send({ msg: "해당 게시글이 없습니다." });
    }
  } catch (err) {
    logger.error('reviews')
    console.log("상제조회 에러");
    res.status(400).send({ msg: "리뷰상세보기가 조회되지 않았습니다." });
  }
};

//리뷰 작성
const review_write = async (req, res) => {
  // 파라미터 정보 가져오기
  const { postId } = req.params;

  // middlewares유저정보 가져오기
  const { user } = res.locals;
  const { userId, nickname, profileImage } = user;
  const reviewId = uuid();

  //작성한 정보 가져옴
  const { reviewTitle, reviewContent } = await reviewSchema.validateAsync(
    req.body
  );

  if (!reviewTitle || !reviewContent) {
    return res.send({ msg: "내용을 입력해주세요" });
  }

  // 리뷰작성시각 생성
  require("moment-timezone");
  moment.tz.setDefault("Asia/Seoul");
  const createdAt = String(moment().format("YYYY-MM-DD HH:mm:ss"));

  let seller = await Buy.findOne(
    { postId },
    "category postId postTitle price imageUrl user.userId user.nickname user.profileImage"
  );

  // 이미지에서 location정보만 저장해줌
  if (req.files.length) {
    for (let i = 0; i < req.files.length; i++) {
      await ReviewImages.create({
        reviewId,
        imageId: uuid(),
        imageNumber: i,
        imageUrl: req.files[i].location,
      });
    }
  }

  try {
    const ReviewList = await Review.create({
      reviewId,
      seller,
      userId,
      nickname,
      profileImage,
      reviewTitle,
      reviewContent,
      createdAt,
    });
    res.status(200).json({
      respons: "success",
      ReviewList,
    });
  } catch {
    logger.error('reviews')
    res.status(400).send({ msg: "리뷰가 작성되지 않았습니다." });
  }
};

//리뷰 수정
const review_modify = async (req, res) => {
  try {
    //수정할 reviewID 파라미터로 받음
    const { reviewId } = req.params;
    //수정할 값 body로 받음
    const { reviewTitle, reviewContent, imgDt } =
      await reviewSchema.validateAsync(req.body);
    //게시글 내용이 없으면 저장되지 않고 alert 뜨게하기.
    if (!reviewTitle || !reviewContent) {
      return res.send({ msg: "내용을 입력해주세요" });
    }

    //key 값을 저장 array
    let deleteItems = [];
    //key값 추출위한 for문
    if (imgDt) {
      if (Array.isArray(imgDt) && imgDt.length > 0) {
        for (let i = 0; i < imgDt.length; i++) {
          deleteItems.push({ Key: String(imgDt[i].split("/")[3]) });
        }
      } else {
        deleteItems.push({ Key: String(imgDt.split("/")[3]) });
      }
      // 첫번째 값 제외 삭제..
      let params = {
        Bucket: process.env.BUCKETNAME,
        Delete: {
          Objects: deleteItems,
          Quiet: false,
        },
      };
      //option을 참조 하여 delete 실행
      s3.deleteObjects(params, function (err, data) {
        if (err) console.log(err);
        else console.log("Successfully deleted myBucket/myKey");
      });
    }
    if (
      Array.isArray(imgDt) &&
      imgDt.length > 0 &&
      imgDt.length === req.files.length
    ) {
      for (let i = 0; i < imgDt.length && i < req.files.length; i++) {
        await ReviewImages.updateOne(
          { imageUrl: imgDt[i] },
          {
            $set: {
              imageUrl: req.files[i].location,
            },
          }
        );
      }
    } else if (
      Array.isArray(imgDt) === false &&
      imgDt &&
      req.files.length === 1
    ) {
      await ReviewImages.updateOne(
        { imageUrl: imgDt },
        {
          $set: {
            imageUrl: req.files[0].location,
          },
        }
      );
    } else if (imgDt || req.files) {
      if (Array.isArray(imgDt) === false && imgDt) {
        await ReviewImages.deleteOne({ reviewId, imageUrl: imgDt });
      } else if (Array.isArray(imgDt)) {
        for (let i = 0; i < imgDt.length; i++) {
          await ReviewImages.deleteOne({ imageUrl: imgDt[i] });
        }
      }
      if (req.files) {
        const max = await ReviewImages.findOne({ reviewId })
          .sort("-imageNumber")
          .exec();
        let num = 0;

        if (max) {
          num = max.imageNumber + 1;
        }
        for (let i = 0; i < req.files.length; i++) {
          await ReviewImages.create({
            reviewId,
            imageUrl: req.files[i].location,
            imageNumber: (num += i),
          });
        }
      }
    }

    //업데이트
    await Review.updateOne(
      { reviewId },
      {
        $set: {
          reviewTitle,
          reviewContent,
        },
      }
    );
    return res.status(200).send({
      respons: "success",
      msg: "수정 완료",
    });
    throw error;
  } catch (error) {
    logger.error('reviews')
    res.status(400).send({
      respons: "fail",
      msg: "수정 실패",
    });
  }
};

//리뷰 삭제
const review_delete = async (req, res) => {
  const { reviewId } = req.params;
  const { userId } = res.locals.user;
  try {
    // 해당 유저와 리뷰가 있는지 확인
    const reviewUser = await Review.findOne({ userId, reviewId }).exec();
    if (reviewUser) {
      // 이미지 URL 가져오기 위한 로직
      const reviewImage = await ReviewImages.find({ reviewId });
      // 복수의 이미지를 삭제 변수(array)
      let deleteItems = [];
      if (reviewImage.length) {
        for (let i = 0; i < reviewImage.length; i++) {
          deleteItems.push({
            Key: String(reviewImage[i].imageUrl.split("/")[3]),
          });
        }
        //삭제를 위한 변수
        let params = {
          //bucket 이름
          Bucket: process.env.BUCKETNAME,
          //delete를 위한 key값
          Delete: {
            Objects: deleteItems,
            Quiet: false,
          },
        };
        //복수의 delete를 위한 코드 변수(params를 받음)
        s3.deleteObjects(params, function (err, data) {
          if (err) console.log(err);
          else console.log("Successfully deleted myBucket/myKey");
        });
        await ReviewImages.deleteMany({ reviewId });
      }
      //delete
      await Review.deleteOne({ reviewId, userId });
      res.status(200).send({
        respons: "success",
        msg: "삭제 완료",
      });
    } else {
      return res.status(400).send({ msg: "해당 게시글이 없습니다." });
    }
  } catch (error) {
    logger.error('reviews')
    res.status(400).send({
      respons: "fail",
      msg: "삭제 실패",
    });
  }
};

module.exports = {
  review,
  review_detail,
  review_write,
  review_modify,
  review_delete,
};
