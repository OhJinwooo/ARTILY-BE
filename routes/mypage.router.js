const express = require("express");
const router = express.Router();
const upload = require("../routes/multer/uploads");
const middleware = require("../middleware/authMiddleWare");
const {
  postProfile,
  getProfile,
  updateProfile,
} = require("./controllers/mypage.controllers");

//프로필 등록
router.patch(
  "/profile",
  middleware,
  upload.single("profileImage"),
  postProfile
);

//마이페이지 조회
router.get("/profile", middleware, getProfile);

//마이페이지 프로필 수정
router.post(
  "/profile/update",
  middleware,
  upload.single("profileImage"),
  updateProfile
);

module.exports = router;
