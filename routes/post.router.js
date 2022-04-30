const express = require("express");
const router = express.Router();
const { test } = require("./controllers/post.controllers");

router.get("/post");

router.post("/test", test);

module.exports = router;
