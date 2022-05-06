const followRouter = require("express").Router();
/**
 * @swagger
 * paths:
 *  /follow/{followUser}:
 *    post:
 *      summary: "팔로우"
 *      description:
 *      tags: [Follow]
 *      parameters:
 *        - in: path
 *          name: followUser
 *          required: true
 *          description: 팔로우 유저
 *      responses:
 *        "200":
 *          description:
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                    follows:
 *                      type: array
 *                      example: ["asdf","wert","dfgh"]
 *                    followers:
 *                      type: array
 *                      example: ["asdf","wert","dfgh"]
 */
router.post("/follow/:followUser", middleware, addfollow);

module.exports = followRouter;
