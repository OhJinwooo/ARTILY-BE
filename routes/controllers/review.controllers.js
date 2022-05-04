const Review = require("../../schemas/review.schemas");
const express = require("express");
const { create } = require("../../schemas/review.schemas");
const moment = require("moment");
const CryptoJS = require("crypto-js");
const s3 = require("../config/s3");

// 리뷰 조회
const review = async (req, res) => {
  // const { user } = res.locals;
  // console.log("user", user);
  // const userId = user.userId;
  // console.log("userId", userId);
  try {
    const review = await Review.find({}).sort("-createdAt").limit(4);
    res.json({ review });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

// 리뷰 상세조회
const review_detail = async (req, res) => {
  try {
    const { reviewId } = req.params;
    console.log(reviewId);
    const review_detail = await Review.find({ _id: reviewId }).sort(
      "-createdAt"
    );
    res.json({ review_detail });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

//리뷰 작성
const review_write = async (req, res) => {
  // const { user } = res.locals;
  // console.log("user", user);
  // const userId = user.userId;
  // console.log("userId", userId);

  //작성한 정보 가져옴
  const { category, nickname, reviewTitle, likeCnt, reviewContent } = req.body;
  console.log(category, nickname, reviewTitle, likeCnt, reviewContent); //ok

  const imageUrl = req.files;
  //console.log("req.files: ", req.files); // ok // 테스트 => req.file.location에 이미지 링크(s3-server)가 담겨있음
  //console.log("imageUrl", imageUrl); //ok
  //사용자 브라우저에서 보낸 쿠키를 인증미들웨어통해 user변수 생성

  // 글작성시각 생성
  require("moment-timezone");
  moment.tz.setDefault("Asia/Seoul");
  const createdAt = String(moment().format("YYYY-MM-DD HH:mm:ss"));
  // console.log(createdAt); //ok
  // const reviewId = CryptoJS.SHA256(createdAt)['words'][0];
  // console.log(reviewId);

  //try {
  const ReviewList = await Review.create({
    category,
    // userId,
    nickname,
    reviewTitle,
    likeCnt,
    imageUrl,
    reviewContent,
    createdAt,
  });
  res.send({ result: "success", ReviewList });
  //} catch {
  //res.status(400).send({ msg: "게시글이 작성되지 않았습니다." });
  //}
};

//리뷰 수정
const review_modify = async (req, res) => {
  const { reviewId } = req.params;
  const { category, reviewTitle, reviewContent } = req.body;
  const imageUrl = req.files;

  // console.log(category, reviewTitle, reviewContent); //ok
  //console.log("imageUrl", imageUrl); //ok

  //게시글 내용이 없으면 저장되지 않고 alert 뜨게하기.
  if (!reviewContent.length) {
    res.status(401).send({ msg: "게시글 내용을 입력해주세요." });
    return;
  }
  try {
    const photo = await Review.find({ _id: reviewId }); // 현재 URL에 전달된 id값을 받아서 db찾음
    console.log("photo", photo); //ok

    const url = photo[0].imageUrl[0].location;
    console.log("imageUrl", imageUrl);
    console.log("url", url); // https://mandublog.s3.ap-northeast-2.amazonaws.com/1651634249849.png

    if (imageUrl) {
      console.log("new이미지====", imageUrl);
      s3.deleteObject(
        {
          Bucket: "mandublog",
          Key: url,
          //key 속성은 업로드하는 파일이 어떤 이름으로 버킷에 저장되는가에 대한 속성이다.
        },
        (err, data) => {
          if (err) {
            throw err;
          }
        }
      );
      await Review.updateOne(
        { _id: reviewId },
        { $set: { category, reviewTitle, reviewContent, imageUrl } }
      );
    } else {
      // 이미지를 변경해주지 않을 때
      const photo = await Review.find({ _id: reviewId });
      // 포스트 아이디를 찾아서 안에 이미지 유알엘을 그대로 사용하기
      const keepImage = photo[0].imageUrl; // ?? 바꿔줘야될듯 ?

      await Review.updateOne(
        { _id: reviewId },
        { $set: { category, reviewTitle, reviewContent, imageUrl: keepImage } }
      );
    }
    const ReviewList = await Review.findOne({ _id: reviewId });
    res.send({ result: "success", ReviewList });
  } catch {
    res.status(400).send({ msg: "게시글이 수정되지 않았습니다." });
  }
};

//리뷰 삭제
const review_delete = async (req, res) => {
  const { reviewId } = req.params;

  try {
    const photo = await Review.find({ _id: reviewId }); // 현재 URL에 전달된 id값을 받아서 db찾음
    console.log("photo", photo); //ok

    const url = photo[0].imageUrl[0].location;
    console.log("url", url); // https://mandublog.s3.ap-northeast-2.amazonaws.com/1651634249849.png

    await Review.deleteOne({ _id: reviewId });
    s3.deleteObject(
      {
        Bucket: "mandublog",
        Key: url,
      },
      (err, data) => {
        if (err) {
          throw err;
        }
      }
    );
    res.send({ result: "success" });
  } catch {
    res.status(400).send({ msg: "게시글이 삭제되지 않았습니다." });
  }
};

module.exports = {
  review,
  review_detail,
  review_write,
  review_modify,
  review_delete,
};
