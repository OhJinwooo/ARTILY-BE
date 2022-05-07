 const express = require("express");
 const router = express.Router();
 const upload = require("../multer/uploads");
 const middleswares = require("../middleware/authMiddleWare");
 const {
   artPost,
   artDetail,
   artStore,
   artUpdate,
   getHome,
   artdelete,
   marckupCnt
 } = require("./controllers/post.controllers");
 router.get("/post", getHome);

 router.get("/post/store", artStore);

 router.get("/post/:postId", artDetail);

 router.post("/post",middleswares,upload.array("img"), artPost);

 router.put("/post/:postId",middleswares, upload.array("img"), artUpdate);

 router.delete("/post/:postId",middleswares,artdelete);

router.post('/cnt/:postId',middleswares,marckupCnt)

module.exports = router;
