const express = require("express");
const router = express.Router();
const middleswares = require("../middleware/authMiddleWare");
const { blackList } = require("./controllers/blackList.controllers");

//리뷰조회
router.put("/blackList/:ReviewUserId", middleswares, blackList);

module.exports = router;
