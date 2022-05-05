// const Post = require("../../schemas/post.schemas");
// const Review = require("../../schemas/review.schemas");
// const sharp = require("sharp");
// const s3 = require("../../config/s3");
// const moment = require("moment");
// const fs = require("fs");
// const path = require("path");
// require("moment-timezone");
// moment.tz.setDefault("Asia/Seoul");
// const { v4 } = require("uuid");
// const { create } = require("../../schemas/user.schemas");
// const { object } = require("webidl-conversions");
// const { fstat } = require("fs");
// const uuid = () => {
//   const tokens = v4().split("-");
//   return tokens[2] + tokens[1] + tokens[3];
// };

// //공통 항목(user에대한 미들웨어 미적용 코드)

//전체조회 페이지 (이달의 작가 추전 부분(임시적 구현 artPost 에 저장된user로 불러옴))
const getHome = async (req, res) => {
  try {
    //limt함수 사용 보여주는 데이터 숫자 제한
    const artPost = await Post.find({});
    //.sort('-marckupCnt') */ /* .limit(4)
    //const artWriter = artPost.user;
    //const reviwPage = await Review.find({}).sort('-Likecount').limit(4);
    // console.log("console", artPost[6].imageUrl);
    res.status(200).json({
      respons: "success",
      msg: "조회 성공",
      data: { artPost /* ,artWriter,reviwPage */ },
    });
  } catch (error) {
    res.status(400).json({
      respons: "file",
      msg: "전체조회 실패",
    });
  }
};

// //스토어 페이지(무한스크롤(임시적용 개선 방안 필요), 필터 기능 (개선 중(시간소요)) )
// const artStore = async (req, res) => {
//   try {
//     //페이지의 시작 값을 받음(테이터의 총개수)
//     const data = req.body;
//     //태그 기능 변수
//     const category = data.category;
//     const transaction = data.transaction;
//     const changeAddress = data.changeAddress;
//     //태그기능 변수 통합
//     const artFilter = {
//       category: category,
//       transaction: transaction,
//       changeAddress: changeAddress,
//     };
//     //시작을 지정할 변수 선언
//     let start = 0;
//     //이미데이터가 넘어가서 있는지 확인
//     if (data.start <= 0) {
//       start = 0;
//     } else {
//       start = data.start - 1;
//     }
//     //마지막 값 지정
//     let last = start + 5;
//     // 지정해서 보내주는 데이터
//     if (data.start && !category && !transaction && !changeAddress) {
//       const artPost = await Post.find({}).limit(start, last);

//       res.status(200).json({
//         respons: "success",
//         msg: "스토어 조회 성공",
//         artPost,
//       });
//     }
//     if (artFilter) {
//       console.log(object.key(artFilter).length);
//       for (let i = 0; i < artFilter.length; i++) {
//         console.log(artFilter[i]);
//         if (artFilter[i] !== undefined) {
//           console.log(artFilter[i]);
//           const fin = cat.find(artFilter[i]);
//           console.log(fin);
//         }
//       }
//     }
//   } catch (error) {
//     res.status(400).json({
//       respons: "fail",
//       msg: "전체조회 실패",
//     });
//   }
// };

//상세조회
const artDetail = async (req, res) => {
  try {
    //파리미터 값받음
    const postId = req.params;
    //상세 페이지 데이터
    const artPost = await Post.findOne({ postId }).exec();
    // 추가 데이터(상세 페이지 작가기준)
    const artPost2 = await Post.find({ user: artPost.user })
      .sort("-createdAt")
      .limit(4);
    req.status(200).json({
      respons: "success",
      msg: "상세페이지 조회 성공",
      data: [artPost, artPost2],
    });
  } catch (error) {
    req.status(200).json({
      respons: "fail",
      msg: "상세페이지 조회 실패",
    });
  }
};

// //작성 api(구현 완료)
// const artPost = async (req, res) => {
//   try {
//     /* // 리사이징(압축용 실험 코드(미적용))
//    const img = sharp(req.files)
//    .withMetadata()
//    .toBuffer((err,buffer)=>
//    {
//      if(err) throw err;
//      fs.withMetadata(req.files,buffer, (err)=>{
//       if (err) throw err;
//      });
//    }); */

    //req.body를 받음
    const { postTitle, postContent, category, transaction, changeAddress } =
      req.body;
    //여러장 이미지 저장
    // let imageUrl = new Array();
    // for (let i = 0; i < req.files.length; i++) {
    //   /* imageUrl.push(`${req.protocol}://${req.get('host')}/img/${req.files[i].filename}`) */
    //   imageUrl.push(req.files[i].location);
    // }
    //moment를 이용하여 한국시간으로 날짜생성
    const createdAt = new moment().format("YYYY-MM-DD HH:mm:ss");
    //uuid를 사용하여 고유 값생성
    const postId = uuid();
    //검증 고유값중복 검증
    const artPostId = await Post.find({ postId }).exec();
    //조건 postId
    console.log(123123);
    if (artPostId.postId !== postId) {
      console.log(321321);
      const artBrod = new Post({
        postTitle,
        postContent,
        category,
        transaction,
        changeAddress,
        // imageUrl,
        postId,
        createdAt,
        done: false,
      });
      await artBrod.save();
      res.status(200).json({
        respons: "success",
        msg: "판매글 생성 완료",
        data: artBrod,
      });
    }
  } catch (error) {
    res.status(400).json({
      respons: "fail",
      msg: "판매글 생성 실패",
    });
  }
};

// //api 수정(삭제 미구현)
// const artUpdate = async (req, res) => {
//   try {
//     //수정할 파라미터 값
//     const postId = req.params.postId;
//     console.log(postId);
//     //바디로 받을 데이터
//     /*  const {
//         postTitle,
//         postContent,
//         category,
//         transaction,
//         changeAddress,
//         } = req.body; */
//     //moment를 이용하여 한국시간으로 날짜생성
//     /* const createdAt = new moment().format('YYYY-MM-DD HH:mm:ss'); */
//     //이미지 수정
//     const artPostimg = await Post.find({ postId: postId });
//     const img = artPostimg[0].imageUrl;
//     for (let i = 0; i < img.length; i++) {
//       console.log(img[i].split("/")[3]);
//       s3.deleteObject(
//         {
//           Bucket: "artvb",
//           key: `${img[i]}`,
//         },
//         function (err, data) {}
//       );
//     }

//     //업데이트
//     /* await Post.updateOne({postId},{
//         $set:{
//         postTitle,
//         postContent,
//         category,
//         transaction,
//         changeAddress,
//         createdAt,
//         imageUrl
//         }
//       }); */
//     res.status(200).send({
//       respons: "success",
//       msg: "수정 완료",
//     });
//   } catch (error) {
//     res.status(400).send({
//       respons: "fail",
//       msg: "수정 실패",
//     });
//   }
// };

// // 삭제
// const artdelete = async (req, res) => {
//   try {
//     //파라미터 값
//     const postId = req.params.postId;
//     // user 정보 일치
//     const { user } = req.locals;
//     //delete
//     await Post.deleteOne({ postId, user });
//     res.status(200).send({
//       respons: "success",
//       msg: "삭제 완료",
//     });
//   } catch (error) {
//     res.status(400).send({
//       respons: "fail",
//       msg: "삭제 실패",
//     });
//   }
// };
// module.exports = {
//   getHome,
//   artPost,
//   artStore,
//   artDetail,
//   artUpdate,
//   artdelete,
// };
