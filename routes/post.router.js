const express = require("express");
const router = express.Router();
const { artPost, artStore } = require("./controllers/post.controllers");

router.get("/post");

router.get('/post/store', artStore);

router.post("/post", artPost);

module.exports = router;
