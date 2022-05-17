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
  done
} = require("./controllers/post.controllers");

//홈 조회
router.get("/post", getHome);

//스토어 조회
router.get("/post/store", artStore);

//상세페이지 조회
router.get("/post/:postId", artDetail);

//작품 등록
router.post("/post", middleware, upload.array("image", 10), artPost);

//작품 판매글 수정
router.patch("/post/:postId", middleware , upload.array("image", 10), artUpdate);
//작품 판매 완료
router.patch("/post/done/:postId", middleware, done)

//작품 판매글 삭제
router.delete("/post/:postId", middleware, artdelete);

//작품 찜하기
router.post("/markup/:postId", middleware, markupCnt);

module.exports = router;
