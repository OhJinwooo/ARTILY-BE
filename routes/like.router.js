const express = require("express");
const router = express.Router();
const middleswares = require("../middleware/authMiddleWare");
const { like } = require("./controllers/like.controllers");

//좋아요/취소
router.post("/like/:reviewId", middleswares, like);

module.exports = router;
