const express = require("express");
const router = express.Router();
const { user } = require("./controllers/user.controllers");
const middleswares = require("../middleware/authMiddleWare");

//사용자 인증
router.get("/users", middleswares, user);

module.exports = router;
