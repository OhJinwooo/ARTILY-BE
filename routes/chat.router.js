const express = require("express");
const router = express.Router();
const middleswares = require("../middleware/authMiddleWare");
const { chatData, messages } = require("./controllers/chat.controllers");

//채팅 방 조회
router.get("/chats/data", middleswares, chatData);

//채팅 내용 조회
router.get("/chats/messages/:roomname", middleswares, messages);

module.exports = router;
