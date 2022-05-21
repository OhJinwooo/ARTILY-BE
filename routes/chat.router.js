const express = require("express");
const router = express.Router();
const middleswares = require("../middleware/authMiddleWare");
const { chatData, messages } = require("./controllers/chat.controllers");

router.get("/chat/data", middleswares, chatData);

router.get("/chat/messages/:roomName", middleswares, messages);

module.exports = router;
