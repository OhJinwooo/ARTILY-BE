const Post = require("../../schemas/post.schemas");
const Review = require("../../schemas/review.schemas");
const User = require("../../schemas/user.schemas");
const sharp = require("sharp");
const s3 = require("../config/s3");
const moment = require("moment");
const fs = require("fs");
const path = require("path");
require("moment-timezone");
moment.tz.setDefault("Asia/Seoul");
const { v4 } = require("uuid");
const { create } = require("../../schemas/user.schemas");
const { object } = require("webidl-conversions");
const { fstat } = require("fs");
const { ppid } = require("process");
const uuid = () => {
  const tokens = v4().split("-");
  return tokens[2] + tokens[1] + tokens[3];
};

//공통 항목(user에대한 미들웨어 미적용 코드)

//전체조회 페이지 (이달의 작가 추전 부분(임시적 구현 artPost 에 저장된user로 불러옴))
const getHome = async (req, res) => {
  try{
      //limt함수 사용 보여주는 데이터 숫자 제한
      const artPost = await Post.find({}).sort('-marckupCnt').limit(4) ;
      const artWriter = artPost.user;
      const reviwPage = await Review.find({}).sort('-Likecount').limit(4); 
      res.status(200).json({
        respons:'success',
        msg:'조회 성공',
        data:{artPost,artWriter,reviwPage }
      });
  }catch(error){
    res.status(400).json({
      respons: "file",
      msg: "전체조회 실패",
    });
  }
};

//스토어 페이지(무한스크롤(임시적용 개선 방안 필요), 필터 기능 (개선 중(시간소요)) )
const artStore = async(req,res)=>{
  try{
    //페이지의 시작 값을 받음(테이터의 총개수)
    const data = req.body;
    const keyword = req.query.keyword;
    //태그 기능 변수
    const category = data.category;
    const transaction = data.transaction;
    const changeAddress = data.changeAddress;
    // 일반적인 상태(조건이 없을 때)
    if(
        keyword &&
          category &&
          transaction &&
          changeAddress
        === undefined)
    {
      //infinite scroll 핸들링
      // 변수 선언 값이 정수로 표현
      let page = Math.max(1,parseInt(data.page));
      let limit = Math.max(1,parseInt(data.limit));
      //NaN일때 값지정
      page = !isNaN(page)?page:1;
      limit = !isNaN(limit)?limit:6;
      //제외할 데이터 지정
      let skip = (page-1)*limit;
      let artPost = await Post.find({}).sort("-createdAt").skip(skip).limit(limit);
      res.status(200).json({
        respons:"success",
        msg:"스토어 조회 성공",
        data:artPost
      });
    }else{
      //infinite scroll 핸들링
      // 변수 선언 값이 정수로 표현
      let page = Math.max(1,parseInt(data.page));
      let limit = Math.max(1,parseInt(data.limit));
      //NaN일때 값지정
      page = !isNaN(page)?page:1;
      limit = !isNaN(limit)?limit:6;
      //제외할 데이터 지정
      let skip = (page-1)*limit;
      //검색기능      
      let option = [];
      if(keyword){
        option = [{postId: new RegExp(keyword)}]
      }
      // 검색 기능 filter
      if(category!==undefined){
        option.push({category:category})
      }
      if(transaction !== undefined){
        option.push({transaction: transaction});
      }
      if(changeAddress !== undefined){
        option.push({changeAddress:changeAddress})
      }
      //search and filter = option
      const artPost = await Post.find({$and:option}).skip(skip).limit(limit);
      res.status(200).json({
        respons:"success",
        msg:'filter complete',
        data:artPost
      })
    };
  }catch(error){
    res.status(400).json({
      respons:"fail",
      msg:'store조회 실패'
    });
  };
};

//상세조회(판매자가 판매완료 시 상태 변화 기능 추가)
const artDetail = async(req,res) => {
  try{
      //파리미터 값받음
      const {postId} = req.params ;
    if(postId) 
    {
        //상세 페이지 데이터
      const detail = await Post.findOne({postId}).exec();
      // 추가 데이터(상세 페이지 작가기준)
      const getUser = await Post.find({uesrId:detail.userId}).sort('-createdAt').limit(4);
      req.status(200).json({
        respons:"success",
        msg:'상세페이지 조회 성공',
        detail,getUser
      });
    }
    const {user} = res.locals;
     if(user.userId){ 
      //user로 post  확인
      const artPost1 = await Post.findOne({uesrId:user.uesrId}).exec();
      const detail = await Post.findOne({postId}).exec();
      //작성 유저 인지 확인 조건
      if(detail.postId === artPost1.postId){
        //조건 통과시 true값으로 변환
        const data = await Post.updateOne({postId},{$set:{done:true}})
        res.status(200).send({
          respons:'success',
          msg:'판매 완료',
          data: data.done
        });
      };}
  }catch(error){
    req.status(200).json({
      respons:"fail",
      msg:'상세페이지 조회 실패',
    })
  };
}

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
    } = req.body;
    //여러장 이미지 저장
    let imageUrl = new Array();
    for (let i = 0; i < req.files.length; i++) {
      imageUrl.push(req.files[i].location);
    }
    //moment를 이용하여 한국시간으로 날짜생성
    const createdAt = new moment().format("YYYY-MM-DD HH:mm:ss");
    //uuid를 사용하여 고유 값생성
    const postId = uuid();
    //검증 고유값중복 검증
    const artPostId = await Post.find({ postId }).exec();
    //조건 postId
    if (artPostId.postId !== postId) {
      const artBrod = new Post({
        postTitle,
        postContent,
        category,
        transaction,
        changeAddress,
        imageUrl,
        postId,
        price,
        createdAt,
        marckupCnt: 0,
        done: false,
        user,
      });
      await artBrod.save();
      res.status(200).json({
        respons: "success",
        msg: "판매글 생성 완료",
      });
    }
  } catch (error) {
    res.status(400).json({
      respons: "fail",
      msg: "판매글 생성 실패",
    });
  }
};

//api 수정(구현완료)
const artUpdate = async (req, res) => {
  try {
    const { user } = res.locals;
    //수정할 파라미터 값
    const { postId } = req.params;
    //바디로 받을 데이터
    const {
      postTitle,
      postContent,
      category,
      transaction,
      changeAddress,
      price,
    } = req.body;

    //moment를 이용하여 한국시간으로 날짜생성
    const createdAt = new moment().format("YYYY-MM-DD HH:mm:ss");
    //이미지 수정
    const artPostimg = await Post.find({ postId });

    const img = artPostimg[0].imageUrl;
    //key 값을 저장 array
    let deleteItems = [];
    //key값 추출위한 for문
    for (let i = 0; i < img.length; i++) {
      //key값을 string으로 지정
      deleteItems.push({ Key: String(img[i].split("/")[3]) });
    }
    // s3 delete를 위한 option
    let params = {
      Bucket: "myawsbukets",
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

    //여러장 이미지 저장
    let imageUrl = new Array();
    for (let i = 0; i < req.files.length; i++) {
      imageUrl.push(req.files[i].location);
    }
    if (user) {
      //업데이트
      await Post.updateOne(
        { postId },
        {
          $set: {
            postTitle,
            postContent,
            category,
            transaction,
            changeAddress,
            createdAt,
            imageUrl,
            price,
          },
        }
      );
      res.status(200).send({
        respons: "success",
        msg: "수정 완료",
      });
    }
  } catch (error) {
    res.status(400).send({
      respons: "fail",
      msg: "수정 실패",
    });
  }
};

// 삭제(구현 완료)
const artdelete = async (req, res) => {
  try {
    //파라미터 값
    const postId = req.params.postId;
    // user 정보 일치
    const { userId } = res.locals.user;
    //해당 유저 비교 조건 변수
    const postUser = await Post.findOne({ userId, postId });
    if (postUser) {
      //이미지 URL 가져오기 위한 로직
      const artPostimg = await Post.find({ postId });
      const img = artPostimg[0].imageUrl;
      // 복수의 이미지를 삭제 변수(array)
      let deleteItems = [];
      //imageUrl이 array이 때문에 접근하기 위한 for문
      for (let i = 0; i < img.length; i++) {
        // 추가하기 위한 코드(string으로 해야 접근 가능)
        deleteItems.push({ Key: String(img[i].split("/")[3]) });
      }
      //삭제를 위한 변수
      let params = {
        //bucket 이름
        Bucket: "myawsbukets",
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
      await Post.deleteOne({ postId, userId });
      res.status(200).send({
        respons: "success",
        msg: "삭제 완료",
      });
    }
  } catch (error) {
    res.status(400).send({
      respons:'fail',
      msg:'삭제 실패'
    });
  };
};

// 찜기능
const marckupCnt = async(req,res)=>{
  try{
      const {postId} = req.params ;
      const {user} = res.locals ;
      // 갇은 post에 찜했는 지 확인
      const Cnt = await User.findOne({user:user.userId,myMarkup:postId});
      if(Cnt === null){
        // 생성 로직
        await User.findOneAndUpdate({user:user.userId},{$push:{myMarkup:postId}});
        await Post.findOneAndUpdate({postId},{$inc:{marckupCnt:+1}});
        // 해당 post 에 찜개수
        const artPost = await Post.findOne({postId});
        res.status(200).json({
          respons:'success',
          msg:"성공",
          data:artPost.marckupCnt
        });
      }
      else{
        // 있을 시 삭제  
        await User.updateOne({user:user.userId},{$pull:{myMarkup:postId}});
        await Post.updateOne({postId},{$inc:{marckupCnt:-1}});
        //개수
        const artPost = await Post.findOne({postId});
        res.status(200).json({
          respons:'success',
          msg:"취소",
          data:artPost.marckupCnt
        });
      };
  }catch(error){
    res.status(400).send({
      respons:'fail',
      msg:'실패'
    });
  }
};

module.exports = { getHome, artPost, artStore , artDetail, artUpdate, artdelete, marckupCnt};
