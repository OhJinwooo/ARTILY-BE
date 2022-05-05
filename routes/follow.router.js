const express = require("express");
const router = express.Router();
const middleware = require("../middleware/authMiddleWare");
const { addfollow } = require("./controllers/follow.controllers");

//팔로우
router.post("/follow/:followUser", middleware, addfollow);

module.exports = router;
