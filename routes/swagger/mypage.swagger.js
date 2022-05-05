const mypageRouter = require("express").Router();
/**
/**
 * @swagger
 *   /profile:
 *     patch:
 *      summary: "초반 프로필 설정"
 *      description: 
 *      tags: [Mypage]
 *      requestBody:
 *        description: 
 *        required: true
 *        content:
 *          application/x-www-form-urlencoded:
 *            schema:
 *              type: object
 *              properties:
 *                nickname:
 *                  type: string
 *                  example: "예술사랑"
 *                profileImage:
 *                  type: string
 *                  example: "adsfadsf"
 *                address:
 *                  type: string
 *                  example: "광주광역시 남구 봉선동"
 *                introduce:
 *                  type: string
 *                  example: "홍대 서양미술과"
 *                snsUrl:
 *                  type: Array
 *                  example: ["인스타url", "페이스북url"]
 *      responses:
 *        "200":

 */
mypageRouter.patch("/profile", middleware, postProfile);

/**
 * @swagger
 *  /profile:
 *    get:
 *      summary: "프로필 조회"
 *      description: "서버에 데이터를 보내지 않고 Get방식으로 요청"
 *      tags: [Mypage]
 *      responses:
 *        "200":
 *          description:
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                    myprofile:
 *                      type: array
 *                      example: "user정보"
 */
mypageRouter.get("/profile", middleware, getProfile);

/**
/**
 * @swagger
 *   /profile/update:
 *     patch:
 *      summary: "프로필 수정"
 *      description: "Patch 방식을 통해 특정 프로필정보 수정"
 *      tags: [Mypage]
 *      requestBody:
 *        description: 
 *        required: true
 *        content:
 *          application/x-www-form-urlencoded:
 *            schema:
 *              type: object
 *              properties:
 *                nickname:
 *                  type: string
 *                  example: "예술사랑"
 *                profileImage:
 *                  type: string
 *                  example: "adsfadsf"
 *                address:
 *                  type: string
 *                  example: "광주광역시 남구 봉선동"
 *                introduce:
 *                  type: string
 *                  example: "홍대 서양미술과"
 *                snsUrl:
 *                  type: Array
 *                  example: ["인스타url", "페이스북url"]
 *      responses:
 *        "200":
 */
mypageRouter.patch("/profile/update", middleware, updateProfile);

module.exports = mypageRouter;
