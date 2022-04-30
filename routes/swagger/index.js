const router = require("express").Router();
const user = require("./user");
const post = require("./post");
const review = require("./review");

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: 유저 추가 수정 삭제 조회
 */
router.use("/user", user);

/**
 * @swagger
 * tags:
 *   name: Post
 *   description: post
 */
router.use("/post", post);

// /**
//  * @swagger
//  * tags:
//  *   name: Reivew
//  *   description: review
//  */
// router.use("/review", review);

module.exports = router;
