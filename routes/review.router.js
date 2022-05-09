const express = require("express");
const router = express.Router();
const upload = require("../routes/multer/uploads");
const middleswares = require("../middleware/authMiddleWare");
const {
  review,
  review_detail,
  review_write,
  review_modify,
  review_delete,
} = require("./controllers/review.controllers");

//리뷰조회
router.get("/review", review);

//리뷰상세조회;
router.get("/review/:reviewId", review_detail);

//리뷰작성
router.post(
  "/review/:postId",
  middleswares,
  upload.array("imageUrl", 10),
  review_write
);

//리뷰수정
router.patch(
  "/review/:reviewId",
  middleswares,
  upload.array("imageUrl", 10),
  review_modify
);

//리뷰삭제
router.delete("/review/:reviewId", middleswares, review_delete);

module.exports = router;
