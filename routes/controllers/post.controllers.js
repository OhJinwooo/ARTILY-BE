require("dotenv").config();
const Post = require("../../schemas/post.schemas");
const Review = require("../../schemas/review.schemas");
const User = require("../../schemas/user.schemas");
const postImg = require("../../schemas/postImage.schemas");
const reviewImg = require("../../schemas/reviewImage.schemas");
const MarkUp = require("../../schemas/markUp.schemas");
const buyPost = require("../../schemas/buy.schemas");
const {logger,stream}  =require('../../middleware/logger');
const Joi = require("joi");
const postSchema = Joi.object({
      postTitle:Joi.string().required(),
      postContent:Joi.string().min(3).max(300).required(),
      category:Joi.string().max(7).required(),
      transaction:Joi.string().max(10).required(),
      changeAddress:Joi.string(),
      price:Joi.number().min(0).max(9999999).required(),
      postSize:Joi.string().max(40),
      imgDt:Joi.string()
});

const s3 = require("../config/s3");
const moment = require("moment");
require("moment-timezone");
moment.tz.setDefault("Asia/Seoul");
const { v4 } = require("uuid");
const { set } = require("mongoose");
const uuid = () => {
  const tokens = v4().split("-");
  return tokens[2] + tokens[1] + tokens[3];
};

//공통 항목(user에대한 미들웨어 미적용 코드)

//전체조회 페이지 (이달의 작가 추전 부분(임시적 구현 artPost 에 저장된user로 불러옴))
const getHome = async (req, res) => {
  try {
    //limt함수 사용 보여주는 데이터 숫자 제한
    const bestPost = await Post.find(
      {},
      "postId postTitle imageUrl transaction price markupCnt createdAt changeAddress user"
    )
      .sort("-markupCnt")
      .limit(4);
    if (bestPost.length) {
      for (let i of bestPost) {
        const imge = await postImg.findOne({ postId: i.postId });
        i.images = imge;
        if (i.images === null) {
          i.images = [""];
        }
      }
    }

    const bestWriter = [];
    for (let i = 0; i < bestPost.length; i++) {
      bestWriter.push(bestPost[i].user);
    }
    for (let i = 0; i < bestWriter.length; i++) {
      let count = await Post.find(
        { "user.userId": bestWriter[i].userId },
        "postId user.userId"
      );
      bestWriter[i].postCount = count.length;
    }

    const bestReview = await Review.find(
      {},
      "reviewId imageUrl reviewTitle reviewContent likeCnt nickname profileImage"
    )
      .sort("-likeCnt")
      .limit(4);
    if (bestReview.length) {
      for (let i of bestReview) {
        const imge = await reviewImg.findOne({ reviewId: i.reviewId });
        i.images = imge;
        if (i.images === null) {
          i.images = [""];
        }
      }
    }
    res.status(200).json({
      respons: "success",
      msg: "조회 성공",
      data: { bestPost, bestWriter, bestReview },
    });
  } catch (error) {
    logger.error('post')
    res.status(400).json({
      respons: "file",
      msg: "전체조회 실패",
    });
  }
};

//스토어 페이지 구현
const artStore = async (req, res) => {
  try {
    //페이지의 시작 값을 받음(테이터의 총개수)
    const data = req.body;
    const keyword = req.query.keyword;
    //태그 기능 변수
    const category = data.category;
    const transaction = data.transaction;
    const changeAddress = data.changeAddress;
    const price = data.price;

    // 일반적인 상태(조건이 없을 때)
    if (
      keyword === undefined &&
      category === undefined &&
      transaction === undefined &&
      changeAddress === undefined &&
      price === undefined
    ) {
      
      const artPost = await Post.find(
        { done: { $ne: true } },
        "postId postTitle imageUrl transaction price markupCnt changeAddress createdAt category user"
      ).sort("-createdAt");
     
      for (let i of artPost) {
        const img = await postImg.findOne({ postId: i.postId });
        i.images = img;
        if (i.images === null) {
          i.images = [""];
        }
      }
      if (Array.isArray(artPost) && artPost.length === 0) {
        return res.status(200).json({
          respons: "fail",
          msg: "데이터 없음",
          data: [],
        });
      } else {
        res.status(200).json({
          respons: "success",
          msg: "스토어 조회 성공",
          data: artPost,
        });
      }
    } else {
      
      //검색기능
      let option = [];
      if (keyword) {
        option = [{ postTitle: new RegExp(keyword) }];
      }
      // 검색 기능 filter
      if (category !== undefined) {
        option.push({ category: category });
      }
      if (transaction !== undefined) {
        option.push({ transaction: transaction });
      }
      if (changeAddress !== undefined) {
        option.push({ changeAddress: Number(changeAddress) });
      }
      if (price !== undefined) {
        option.push({ price: price });
      }
      //search and filter = option
      const artPost = await Post.find(
        { done: { $ne: true }, $and: option },
        "postId postTitle imageUrl transaction price markupCnt changeAddress createdAt category user"
      )
        .sort("-createdAt")
        .exec(); 
      for (let i of artPost) {
        const img = await postImg.findOne({ postId: i.postId });
        i.images = img;
        if (i.images === null) {
          i.images = [""];
        }
      }
      if (Array.isArray(artPost) && artPost.length === 0) {
        return res.status(200).json({
          respons: "fail",
          msg: "데이터 없음",
          data: [],
        });
      } else {
        res.status(200).json({
          respons: "success",
          msg: "filter complete",
          data: artPost,
        });
      }
    }
  } catch (error) {
    logger.error('post')
    res.status(400).json({
      respons: "fail",
      msg: "store조회 실패",
    });
  }
};

//상세조회
const artDetail = async (req, res) => {
  try {
    //파리미터 값받음
    const { postid } = req.params;
    if (postid) {
      //상세 페이지 데이터
      const detail = await Post.find({ postId:postid });
      for (let j of detail) {
        const images = await postImg.find({ postId: j.postId });
        j.images = images;
        if (j.images === null) {
          j.images = [""];
        }
      }
      // 추가 데이터(상세 페이지 작가기준)
      const getUser = await Post.find({
        postId: { $ne: postid },
        "user.userId": detail[0].user.userId,
      })
        .sort("-createdAt")
        .limit(4);
      for (let j of getUser) {
        const images = await postImg.find({ postId: j.postId });
        j.images = images;
        if (j.images === null) {
          j.images = [""];
        }
      }
      res.status(200).json({
        respons: "success",
        msg: "상세페이지 조회 성공",
        data: { detail, getUser },
      });
    }
  } catch (error) {
    logger.error('post')
    res.status(400).json({
      respons: "fail",
      msg: "상세페이지 조회 실패",
    });
  }
};

// 작품 상태 변환
const done = async (req, res) => {
  try {
    const { postid } = req.params;
    const { userId } = res.locals.user;
    const data = req.body;
    const createdAt = new moment().format("YYYY-MM-DD HH:mm:ss");
    const userPost = await Post.findOne({ userId, postId:postid });

    if (userPost.done === false) {
      const image = await postImg.findOne({ postId:postid }).sort("createdAt").exec();
      await buyPost.create({
        postTitle: userPost.postTitle,
        price: userPost.price,
        category: userPost.category,
        user: userPost.user,
        createdAt,
        userId: data.userId,
        imageUrl: image.imageUrl,
        postId,
      });
      await Post.updateOne(
        { postId:postid },
        {
          $set: {
            done: true,
          },
        }
      );

      res.status(200).send({
        respons: "success",
        msg: "판매 완료",
      });
    } else {
      res.status(200).send({
        respons: "success",
        msg: "판매 완료 실패",
      });
    }
  } catch (error) {
    logger.error('post')
    res.status(400).json({
      respons: "fail",
      msg: "데이터를 찾을 수 없음",
    });
  }
};

//작성 api(구현 완료)
const artPost = async (req, res) => {
  try {
    const { user } = res.locals;
    //req.body를 받음
    const {
      postTitle,
      postContent,
      category,
      transaction,
      changeAddress,
      price,
      postSize,
    } = await postSchema.validateAsync(req.body);
    //moment를 이용하여 한국시간으로 날짜생성
    const createdAt = new moment().format("YYYY-MM-DD HH:mm:ss");
    //uuid를 사용하여 고유 값생성
    const postId = uuid();
    //검증 고유값중복 검증
    const artPostId = await Post.find({ postId }).exec();
    console.log(req.files)
    //여러장 이미지 저장
    for (let i = 0; i < req.files.length; i++) {
      await postImg.create({
        postId,
        imageUrl: req.files[i].location,
        imageNumber: i,
      });
    }
    //조건 postId
    if (artPostId.postId !== postId) {
      const artBrod = new Post({
        postTitle,
        postContent,
        category,
        transaction,
        changeAddress,
        postId,
        price,
        createdAt: createdAt,
        markupCnt: 0,
        done: false,
        user,
        postSize,
      });
      await artBrod.save();
      res.status(200).json({
        respons: "success",
        msg: "판매글 생성 완료",
      });
    }
  } catch (error) {
    logger.error('post')
    res.status(400).json({
      respons: "fail",
      msg: "판매글 생성 실패",
    });
  }
};

//api 수정(구현완료)
const artUpdate = async (req, res) => {
  try {
    const { userId } = res.locals.user;
    //수정할 파라미터 값
    const { postid } = req.params;
    //바디로 받을 데이터
    const {
      postTitle,
      postContent,
      category,
      transaction,
      changeAddress,
      price,
      postSize,
      imgDt,
    } = await postSchema.validateAsync(req.body);
    const userPost = await Post.findOne({ postId:postid, userId }).exec();
    if (userPost) {
      //moment를 이용하여 한국시간으로 날짜생성
      const createdAt = new moment().format("YYYY-MM-DD HH:mm:ss");

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
          await postImg.updateOne(
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
        await postImg.updateOne(
          { imageUrl: imgDt },
          {
            $set: {
              imageUrl: req.files[0].location,
            },
          }
        );
      } else if (imgDt || req.files) {
        if (Array.isArray(imgDt) === false && imgDt) {
          await postImg.deleteOne({ postId:postid, imageUrl: imgDt });
        } else if (Array.isArray(imgDt)) {
          for (let i = 0; i < imgDt.length; i++) {
            await postImg.deleteOne({ imageUrl: imgDt[i] });
          }
        }
        if (req.files) {
          const max = await postImg
            .findOne({ postId:postid })
            .sort("-imageNumber")
            .exec();
          let num = 0;

          if (max) {
            num = max.imageNumber + 1;
          }
          for (let i = 0; i < req.files.length; i++) {
            await postImg.create({
              postId,
              imageUrl: req.files[i].location,
              imageNumber: (num += i),
            });
          }
        }
      }
      //업데이트
      await Post.updateOne(
        { postId:postid },
        {
          $set: {
            postTitle,
            postContent,
            category,
            transaction,
            changeAddress,
            createdAt,
            price,
            postSize,
          },
        }
      );
      return res.status(200).send({
        respons: "success",
        msg: "수정 완료",
      });
    }
    throw error;
  } catch (error) {
    logger.error('post')
    res.status(400).send({
      respons: "fail",
      msg: "수정 실패",
    });
  }
};

// 삭제(구현 완료)
const artdelete = async (req, res) => {
  try {
    const { userId } = res.locals.user;
    //수정할 파라미터 값
    const { postid } = req.params;
    //해당 유저 비교 조건 변수
    const postUser = await Post.findOne({ userId, postId:postid }).exec();
    if (postUser) {
      //이미지 URL 가져오기 위한 로직
      const image = await postImg.find({ postId:postid });
      // 복수의 이미지를 삭제 변수(array)
      let deleteItems = [];
      //imageUrl이 array이 때문에 접근하기 위한 for문
      for (let i = 0; i < image.length; i++) {
        // 추가하기 위한 코드(string으로 해야 접근 가능)
        deleteItems.push({ Key: String(image[i].imageUrl.split("/")[3]) });
      }
      deleteItems.shift();
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
      await Post.deleteOne({ postId:postid, userId });
      await postImg.deleteMany({ postId:postid });
      await User.updateOne({ userId }, { $pull: { myPost: postid } });
      res.status(200).send({
        respons: "success",
        msg: "삭제 완료",
      });
    }
  } catch (error) {
    logger.error('post')
    res.status(400).send({
      respons: "fail",
      msg: "삭제 실패",
    });
  }
};

// 찜기능
const markupCnt = async (req, res) => {
  try {
    const { postid } = req.params;
    const { userId } = res.locals.user;
    const userPost = await Post.findOne({ postId:postid }).exec();
    if (userId !== userPost.uesr) {
      // 갇은 post에 찜했는 지 확인
      const Cnt = await MarkUp.findOne({ userId, postId:postid });
      if (Cnt === null) {
        // 생성 로직
        await MarkUp.create({ userId, postId:postid });
        await Post.findOneAndUpdate({ postId:postid }, { $inc: { markupCnt: +1 } });
        // 해당 post 에 찜개수
        res.status(200).json({
          respons: "success",
          msg: "성공",
        });
      } else {
        // 있을 시 삭제
        await MarkUp.deleteOne({ userId, postId:postid });
        await Post.updateOne({ postId:postid }, { $inc: { markupCnt: -1 } });
        //개수
        res.status(200).json({
          respons: "success",
          msg: "취소",
        });
      }
    }
  } catch (error) {
    logger.error('markupCnt')
    res.status(400).send({
      respons: "fail",
      msg: "실패",
    });
  }
};

//내가 좋아요한 markupList 보내기
const markupList = async (req, res) => {
  try {
    //유저 정보가 있는지 확인
    const { user } = res.locals; //ok
    const { userId } = user; //ok
    // 유저정보가 유효한지 확인
    if (userId > 0) {
      const markUp = await MarkUp.find({ userId }, "postId");
      const markUpList = [];
      for (let i = 0; i < markUp.length; i++) {
        markUpList.push(markUp[i].postId);
      }
      return res.status(200).json({ result: "success", markUpList });
    }
    return res.status(401).json({
      response: "fail",
      msg: "유효하지 않은 토큰입니다",
    });
  } catch (error) {
    logger.error('markupList')
    res.status(400).json({
      response: "fail",
      msg: "알수 없는 오류가 발생했습니다.",
    });
  }
};

module.exports = {
  getHome,
  artPost,
  artStore,
  artDetail,
  artUpdate,
  artdelete,
  markupCnt,
  markupList,
  done,
};
