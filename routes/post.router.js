const express = require("express");
const router = express.Router();
const upload = require("./multer/uploads");
const middleware = require("../middleware/authMiddleWare");

const {
  artPost,
  artDetail,
  artStore,
  artUpdate,
  getHome,
  artdelete,
  markupCnt,
  markupList,
  done,
} = require("./controllers/post.controllers");

//홈 조회
router.get("/posts", getHome);

//스토어 조회
router.get("/stores", artStore);

//상세페이지 조회
router.get("/posts/:postId", artDetail);

//작품 등록
router.post("/posts", middleware, upload.array("image", 10), artPost);

//작품 판매글 수정
router.patch("/posts/:postId", middleware, upload.array("image", 10), artUpdate);

//작품 판매 완료
router.patch("/sale/:postId", middleware, done);

//작품 판매글 삭제
router.delete("/posts/:postId", middleware, artdelete);

//작품 찜하기
router.post("/likes/:postId", middleware, markupCnt);

//찜한 목록 불러오기
router.get("/posts/likes", middleware, markupList);

module.exports = router;
