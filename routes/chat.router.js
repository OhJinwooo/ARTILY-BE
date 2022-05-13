const express = require("express");
const router = express.Router();
const middleswares = require("../middleware/authMiddleWare");
const { chatData } = require("./controllers/chat.controllers");

router.get("/chat", middleswares, chatData);

module.exports = router;
