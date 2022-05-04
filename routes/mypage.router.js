const express = require("express");
const router = express.Router();
const middleware = require("../middleware/authMiddleWare");
const { mypage, mypageUpdate } = require("./controllers/mypage.controllers");

router.get("/mypage", middleware, mypage);

router.patch("/mypage/update", middleware, mypageUpdate);
module.exports = router;
