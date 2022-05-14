require("dotenv").config();
const Review = require("../../schemas/review.schemas");
const Post = require("../../schemas/post.schemas");
const User = require("../../schemas/user.schemas");
const moment = require("moment");
const s3 = require("../config/s3");
const { v4 } = require("uuid");
const uuid = () => {
  const tokens = v4().split("-");
  return tokens[2] + tokens[1] + tokens[3];
};

// 리뷰 조회(무한 스크롤)
const review = async (req, res) => {
  try {
    const data = req.params;
    //infinite scroll 핸들링
    // 변수 선언 값이 정수로 표현
    let page = Math.max(1, parseInt(data.page));
    let limit = Math.max(1, parseInt(data.limit));
    //NaN일때 값지정 ??
    page = !isNaN(page) ? page : 1;
    limit = !isNaN(limit) ? limit : 6;
    //제외할 데이터 지정 //다음 페이지 시작점
    let skip = (page - 1) * limit;
    let review = await Review.find({})
      .sort("-createdAt")
      .skip(skip)
      .limit(limit);
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
    // console.log(reviewId);

    //리뷰를 작성한 user 정보
    //구매한 작품&작가 정보 찾기
    let buyer = await Review.findOne({ reviewId });
    console.log("buyer", buyer);

    let s_userId = buyer.seller.user.userId;
    console.log("s_userId", s_userId);

    //내가 구매한 작가의 다른 작품들 찾기
    let defferent = await Post.find(
      { "user.userId": s_userId },
      "postId postTitle price"
    );
    console.log("defferent", defferent);

    res.json({ buyer, defferent });
  } catch (err) {
    console.log("상제조회 에러");
    res.status(400).send({ msg: "리뷰상세보기가 조회되지 않았습니다." });
  }
};
//리뷰 작성
const review_write = async (req, res) => {
  // middlewares유저정보 가져오기
  const { user } = res.locals;
  const userId = user.userId;
  const nickname = user.nickname;
  const profileImage = user.profileImage;
  const { postId } = req.params;
  let seller = await Post.findOne(
    { postId },
    "postId postTitle price imageUrl user.userId user.nickname user.profileImage"
  );

  console.log("ss", seller);
  //작성한 정보 가져옴
  const { reviewTitle, reviewContent } = req.body;
  console.log(reviewTitle, reviewContent); //ok
  // 이미지에서 location정보만 저장해줌
  let imageUrl = new Array();
  for (let i = 0; i < req.files.length; i++) {
    imageUrl.push(req.files[i].location);
  }
  //uuid를 사용하여 고유값인 reviewId 생성
  const reviewId = uuid();
  // 리뷰작성시각 생성
  require("moment-timezone");
  moment.tz.setDefault("Asia/Seoul");
  const createdAt = String(moment().format("YYYY-MM-DD HH:mm:ss"));
  try {
    console.log("Aaa");
    const ReviewList = await Review.create({
      reviewId,
      seller,
      userId,
      nickname,
      profileImage,
      reviewTitle,
      imageUrl,
      reviewContent,
      createdAt,
    });
    await User.updateOne({ userId }, { $push: { myReview: reviewId } });
    res.status(200).json({
      respons: "success",
      ReviewList,
    });
  } catch {
    res.status(400).send({ msg: "리뷰가 작성되지 않았습니다." });
  }
};

//리뷰 수정
const review_modify = async (req, res) => {
  try {
    //수정할 reviewID 파라미터로 받음
    const { reviewId } = req.params;
    //수정할 값 body로 받음
    const { reviewTitle, reviewContent, imgSave } = req.body;
    //게시글 내용이 없으면 저장되지 않고 alert 뜨게하기.
    if (!reviewContent.length) {
      res.status(401).send({ msg: "게시글 내용을 입력해주세요." });
      return;
    }
    // 이미지 수정
    const photo = await Review.find({ reviewId }); // 현재 URL에 전달된 id값을 받아서 db찾음
    const img = photo[0].imageUrl;
    //key 값을 저장 array
    let deleteItems = [];
    //key값 추출위한 for문
    // imgSave 값이 있을때만 delete
    if (imgSave) {
      for (let i = 0; i < img.length; i++) {
        //key값을 string으로 지정
        deleteItems.push({ Key: String(img[i].split("/")[3]) });
      }
      // 첫번쨰값 제외하고 삭제함
      deleteItems.shift();
      //imgSave 제외
      deleteItems.filter((c) => {
        if (Array.isArray(imgSave) && imgSave.length > 0) {
          console.log("여기요");
          for (let i = 0; i < imgSave.length; i++) {
            c.Key !== imgSave[i].split("/")[3];
          }
        } else {
          c.Key !== imgSave.split("/")[3];
        }
      });
      console.log("delete", deleteItems);
      // s3 delete를 위한 option
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
    //여러장 이미지 저장
    let imageUrl = new Array();
    //imgSave 여러개 일때
    if (Array.isArray(imgSave) && imgSave.length > 0) {
      imageUrl.push(img[0]);
      for (let i = 0; i < imgSave.length; i++) {
        imageUrl.push(imgSave[i]);
      }
    }
    // 단일
    else if (imgSave !== undefined) {
      imageUrl.push(img[0]);
      imageUrl.push(imgSave);
    }
    //추가만 할 경우
    if (imgSave === undefined) {
      for (let i = 0; i < img.length; i++) {
        imageUrl.push(img[i]);
      }
    }
    console.log("saving", imageUrl);
    for (let i = 0; i < req.files.length; i++) {
      imageUrl.push(req.files[i].location);
    }

    console.log("imageUrl", imageUrl);

    //업데이트
    await Review.updateOne(
      { reviewId },
      {
        $set: {
          reviewTitle,
          reviewContent,
          imageUrl,
        },
      }
    );
    res.status(200).send({
      respons: "success",
      msg: "수정 완료",
    });
  } catch (error) {
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
    // 이미지 URL 가져오기 위한 로직
    const photo = await Review.find({ reviewId });
    console.log("photo", photo); //ok
    const img = photo[0].imageUrl;
    console.log("img", img);
    //const img = photo[0].imageUrl[0].location;
    // 복수의 이미지를 삭제 변수(array)
    let deleteItems = [];
    //imageUrl이 array이 때문에 접근하기 위한 for문
    for (let i = 0; i < img.length; i++) {
      console.log("Aaa", img[i]);
      // 추가하기 위한 코드(string으로 해야 접근 가능)
      deleteItems.push({ Key: String(img[i].split("/")[3]) });
    }
    console.log("deleteItems", deleteItems);
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
    //delete
    await Review.deleteOne({ reviewId });
    await User.updateOne({ userId }, { $pull: { myReview: reviewId } });
    res.status(200).send({
      respons: "success",
      msg: "삭제 완료",
    });
  } catch (error) {
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
