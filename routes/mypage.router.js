const express = require("express");
const router = express.Router();
const upload = require("./multer/uploads");
const middleware = require("../middleware/authMiddleWare");
const {
  postProfile,
  getProfile,
  myProfile,
  updateProfile,
  getMyPost,
  purchases,
} = require("./controllers/mypage.controllers");

//로그인 후 바로 프로필 등록
router.patch(
  "/profiles",
  middleware,
  upload.single("profileImage"),
  postProfile
);

//상대 프로필 조회 조회
router.get("/profiles/:userid", getProfile);

//내 프로필 조회 조회
router.get("/mypage/profiles", middleware, myProfile);

//마이페이지 프로필 수정
router.patch(
  "/mypage/profiles",
  middleware,
  upload.single("profileImage"),
  updateProfile
);
//판매 작품 관리하기
router.get("/mypage/posts", middleware, getMyPost);

//내가 구입한 상품
router.get("/mypage/purchases", middleware, purchases);

module.exports = router;
