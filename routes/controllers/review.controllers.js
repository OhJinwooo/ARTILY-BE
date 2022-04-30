const Review = require("../../schemas/review.schemas");
const { create } = require("../../schemas/review.schemas");
const moment = require("moment");
// //multer-s3 미들웨어 연결
// require("dotenv").config();
// const authMiddleware = require("../middlewares/auth-middleware");

// const path = require("path");
// let AWS = require("aws-sdk");
// AWS.config.loadFromPath(path.join(__dirname, "../config/s3.json")); // 인증
// let s3 = new AWS.S3();
// let multer = require("multer");
// let multerS3 = require("multer-s3");
// let upload = multer({
//   storage: multerS3({
//     s3: s3,
//     bucket: "sixtagram",
//     key: function (req, file, cb) {
//       let extension = path.extname(file.originalname);
//       cb(null, Date.now().toString() + extension);
//     },
//     acl: "public-read-write",
//   }),
// });


// - category
// - reviewId:
// - userId: 
// - nickname
// - reviewTitle: “너무 만족해요”       - reviewContent
//reviewContent
// 
//- likeCnt: 24
// - imageUrl : [”asdfasdf”, “asdfasdf”, “asdfasdfasdf”]

// 리뷰 조회
const review = async (req, res) => {
  try {
    const review = await Review.find({}).sort("-createdAt");
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
    console.log(reviewId)
    const review_detail = await Review.find({ _id : reviewId });
    res.json({ review_detail });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

//리뷰 작성
const review_write = async (req, res) => {
  //작성한 정보 가져옴
  const { category, userId, nickname, reviewTitle, likeCnt, imageUrl, reviewContent } = req.body;
  console.log(category, userId, nickname, reviewTitle, likeCnt, imageUrl, reviewContent); //ok
  //const imageUrl = req.file?.location;
  //console.log("req.file: ", req.file); // 테스트 => req.file.location에 이미지 링크(s3-server)가 담겨있음
  //console.log(content, imageUrl);
  // 사용자 브라우저에서 보낸 쿠키를 인증미들웨어통해 user변수 생성
  //const { user } = res.locals;
  //const userId = user.userId;
  // console.log(user)  //ok
  // 글작성시각 생성
  require("moment-timezone");
  moment.tz.setDefault("Asia/Seoul");
  const createdAt = String(moment().format("YYYY-MM-DD HH:mm:ss"));
  console.log(createdAt); //ok
  //const reviewId = createdAt.toHexString();
  //console.log(reviewId)
  
  try {
    const ReviewList = await Review.create({
      category, userId, nickname, reviewTitle, likeCnt, imageUrl, reviewContent, createdAt
    });
    res.send({ result: "success", ReviewList });
  } catch {
    res.status(400).send({ msg: "게시글이 작성되지 않았습니다." });
 };
};

//리뷰 수정
const review_modify = async (req, res) => {
  const { reviewId } = req.params;
  const { category, reviewTitle, reviewContent, imageUrl } = req.body;
 // const imageUrl = req.file?.location;

  //게시글 내용이 없으면 저장되지 않고 alert 뜨게하기.
  if (!reviewContent.length) {
    res.status(401).send({ msg: "게시글 내용을 입력해주세요." });
    return;
  }
    await Review.updateOne({  _id : reviewId }, { $set: { category, reviewTitle, reviewContent, imageUrl } });
    const ReviewList = await Review.findOne({  _id : reviewId });

    res.send({ result: "success", ReviewList });
};

//리뷰 삭제
const review_delete = async (req, res) => {
  const { reviewId } = req.params;
  await Review.deleteOne({ _id: reviewId });
  res.send({ result: "success" });

};

module.exports = {
  review,
  review_detail,
  review_write,
  review_modify,
  review_delete,
};
