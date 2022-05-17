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
  getMyBuy,
} = require("./controllers/mypage.controllers");

//프로필 등록
router.patch(
  "/profile",
  middleware,
  upload.single("profileImage"),
  postProfile
);

//상대 프로필 조회 조회
router.get("/profile/:userId", getProfile);

//내 프로필 조회 조회
router.get("/myprofile", middleware, myProfile);

//마이페이지 프로필 수정
router.patch(
  "/profile/update",
  middleware,
  upload.single("profileImage"),
  updateProfile
);
//판매 작품 관리하기
router.get("/mypost", middleware, getMyPost);

//내가 구입한 상품
router.get("/mybuy", middleware, getMyBuy);

module.exports = router;
