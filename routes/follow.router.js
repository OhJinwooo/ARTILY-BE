const express = require("express");
const router = express.Router();
const middleware = require("../middleware/authMiddleWare");
const {
  addfollow,
  follow,
  follower,
  myFollow,
  myFollower,
  deleteFollower,
} = require("./controllers/follow.controllers");

//팔로우
router.post("/follow/:followid", middleware, addfollow);

//내 팔로우 리스트 조회
router.get("/follow/myfollowlist", middleware, myFollow);

//내 팔로워 리스트 조회
router.get("/follow/myfollowerlist", middleware, myFollower);

//다른 유저 팔로우 리스트 조회
router.get("/follow/followlist/:userid", middleware, follow);

//다른 유저 리스트 조회
router.get("/follow/followerlist/:userid", middleware, follower);

//팔로워 삭제
router.delete("/follow/:userid", middleware, deleteFollower);

module.exports = router;
