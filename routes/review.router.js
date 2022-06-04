const express = require("express");
const router = express.Router();
const upload = require("./multer/uploads");
const middleswares = require("../middleware/authMiddleWare");
const {
  review,
  review_detail,
  review_write,
  review_modify,
  review_delete,
} = require("./controllers/review.controllers");

//리뷰조회
router.get("/reviews", review);

//리뷰상세조회
router.get("/reviews/:reviewid", review_detail);

//리뷰작성
router.post(
  "/reviews/:postid",
  middleswares,
  upload.array("imageUrl", 10),
  review_write
);

//리뷰수정
router.patch(
  "/reviews/:reviewid",
  middleswares,
  upload.array("imageUrl", 10),
  review_modify
);

//리뷰삭제
router.delete("/reviews/:reviewid", middleswares, review_delete);

module.exports = router;
