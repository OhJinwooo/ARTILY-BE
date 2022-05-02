// const express = require("express");
// const router = express.Router();
// const upload = require("./multer/uploads");
// const { review } = require("./controllers/review.controllers");
// const { review_detail } = require("./controllers/review.controllers");
// const { review_write } = require("./controllers/review.controllers");
// const { review_modify } = require("./controllers/review.controllers");
// const { review_delete } = require("./controllers/review.controllers");

// //리뷰조회
// router.get("/review", review);

// //리뷰상세조회
// router.get("/review/:reviewId", review_detail);

// //리뷰작성
// router.post("/review", upload.single("imageUrl"), review_write);

// //리뷰수정
// router.patch("/review/:reviewId", upload.single("imageUrl"), review_modify);

// //리뷰삭제
// router.delete("/review/:reviewId", review_delete);

// module.exports = router;
