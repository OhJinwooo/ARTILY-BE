const express = require("express");
const router = express.Router();
const middleswares = require("../middleware/authMiddleWare");
const { like, likeList } = require("./controllers/like.controllers");

//좋아요/취소
router.post("/like/:reviewId", middleswares, like);

//내가 좋아요한 목록
router.get("/like/", middleswares, likeList);

module.exports = router;
