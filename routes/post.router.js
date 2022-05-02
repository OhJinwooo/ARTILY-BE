const express = require("express");
const router = express.Router();
const upload = require('../multer/uploads');
const { artPost, artDetail,artStore, artUpdate, getHome } = require("./controllers/post.controllers");
router.get("/post",getHome);

router.get('/post/store', artStore);

router.get('/post/:postId', artDetail);

router.post("/post",upload.array('img'),artPost);

router.put('/post/:postId',upload.array('img'),artUpdate);

router.delete('/post/:postId');

module.exports = router;
