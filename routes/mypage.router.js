const express = require("express");
const router = express.Router();
const middleware = require("../middleware/authMiddleWare");
const { mypage } = require("./controllers/mypage.controllers");

router.get("/mypage", middleware, mypage);

module.exports = router;
