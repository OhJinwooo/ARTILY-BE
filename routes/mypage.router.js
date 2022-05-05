const express = require("express");
const router = express.Router();
const middleware = require("../middleware/authMiddleWare");
const {
  postProfile,
  getProfile,
  updateProfile,
} = require("./controllers/mypage.controllers");

//프로필 등록
router.patch("/profile", middleware, postProfile);

//마이페이지 조회
router.get("/profile", middleware, getProfile);

//마이페이지 프로필 수정
router.patch("/profile/update", middleware, updateProfile);

router.patch("/mypage/update", middleware, mypageUpdate);
module.exports = router;
