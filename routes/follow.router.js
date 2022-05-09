const express = require("express");
const router = express.Router();
const middleware = require("../middleware/authMiddleWare");
const {
  addfollow,
  getFollow,
  getFollower,
} = require("./controllers/follow.controllers");

//팔로우
router.post("/follow/:followId", middleware, addfollow);

//내 팔로우 리스트 조회
router.get("/follow/followlist", middleware, getFollow);

//내 팔로워 리스트 조회
router.get("/follow/followerlist", middleware, getFollower);

module.exports = router;
