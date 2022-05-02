const express = require("express");
const router = express.Router();
const upload = require('../multer/uploads');
const { artPost } = require("./controllers/post.controllers");
router.get("/post");

/* router.get('/post/store', artStore); */

router.post("/post",upload.array('img'),artPost);

module.exports = router;
