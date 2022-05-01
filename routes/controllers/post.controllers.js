const Post = require("../../schemas/post.schemas");
const cat = require('../controllers/psot.test')
const Review = require('../../schemas/review.schemas');
const moment = require('moment')
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");
const { v4 } = require('uuid');
const { create } = require("../../schemas/user.schemas");
const uuid = () => {
  const tokens = v4().split('-')
  return tokens[2] + tokens[1] + tokens[3] ;
}


//전체조회 페이지 (이달의 작가 추전 부분(임시적 구현 artPost 에 저장된user로 불러옴))
const getHome = async (req, res) => {
  try{
      //limt함수 사용 보여주는 데이터 숫자 제한
      const artPost = await Post.find({}).sort('-Likecount').limit(4);
      const artWriter = artPost.user;
      const reviwPage = await Review.find({}).sort('-Likecount').limit(4);
      res.status(200).json({
        respons:'success',
        msg:'조회 성공',
        data:{artPost,artWriter,reviwPage}
      })
  }catch(error){
    res.status(400).json({
      respons:"file",
      msg:'전체조회 실패'
    })
  }
};

//스토어 페이지(무한스크롤(임시적용 개선 방안 필요), 필터 기능 (임시적용 개선 방안 필요) )
const artStore = async(req,res)=>{
  try{
    //페이지의 시작 값을 받음(테이터의 총개수)
    const page = req.body
    //시작을 지정할 변수 선언
    let start = 0;
    //이미데이터가 넘어가서 있는지 확인
    if(page.start <= 0){
      start = 0 ;
    }else{
      start = page.start - 1
    };
    //마지막 값 지정
    let last = start + 5
    // 지정해서 보내주는 데이터
    const artPost = await Post.find({}).limit(start,last);
    if(page.category && !page.transaction){
      const artPost = await Post.find({category:page.category}).limit(start,last);
      res.status(200).json({
        respons:"success",
        msg:'스토어 조회 성공',
        artPost
      });
    }else if(page.category && page.transaction){
      const artPost = await Post.find({
        category:page.category,
        transaction:page.transaction
      }).limit(start,last);
      res.status(200).json({
        respons:"success",
        msg:'스토어 조회 성공',
        artPost
      });
    }
    res.status(200).json({
      respons:"success",
      msg:'스토어 조회 성공',
      artPost
    });
  }catch(error){
    res.status(400).json({
      respons:"file",
      msg:'전체조회 실패'
    });
  };
};

//작성 api(이미지 및 영상 첨부 기능 미구현)
const artPost = async (req, res) => {
 try{
  //data라는 변수로 body를 받음
  const {} = req.body;
  const {} = res.locals ;
  //uuid를 사용하여 고유 값생성
  const postId = uuid();
  //moment를 이용하여 한국시간으로 날짜생성
  const createdAt = new moment().format('YYYY-MM-DD HH:mm:ss');
  //검증 고유값중복 검증
  const artPostId = await Post.find({postId}).exec();
  //조건 postId
  if(artPostId.postId !== postId){
    const artBrod = new Post({});
    await artBrod.save();
    res.status(200).json({
      respons:"success",
      msg:'판매글 생성 완료'
    });
  }
  }catch(error){
    res.status(400).json({
      respons:"file",
      msg:'판매글 생성 실패'
    })
  }
};
module.exports = { getHome, artPost, artStore };
