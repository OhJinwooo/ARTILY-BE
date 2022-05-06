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
 *                  type: array
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
 *                    _id:
 *                      type: string
 *                      example: "asdfadsf"
 *                    userId:
 *                      type: string
 *                      example: "234343223"
 *                    nickname:
 *                      type: string
 *                      example: "만두조아"
 *                    provider:
 *                      type: string
 *                      example: "kakao"
 *                    profileUrl:
 *                      type: string
 *                      example: "http://k.kakaocdn.net/dn/Ksadfasdfm4z/bwasdfaJ30p1/img_640x640.jpg"
 *                    refreshToken:
 *                      type: string
 *                      example: "asdfasdfdasfadsf"
 *                    address:
 *                      type: string
 *                      example: "광주 남구 봉선동"
 *                    followCnt:
 *                      type: number
 *                      example: 13
 *                    followerCnt:
 *                      type: number
 *                      example: 20
 *                    follow:
 *                      type: array
 *                      example: ["abcd123","qwer345"]
 *                    follower:
 *                      type: array
 *                      example: ["abcd12d3","qwer34d5"]
 *                    blacklist:
 *                      type: array
 *                      example: ["abcd1s23","qwer34f5"]
 *                    myBuy:
 *                      type: array
 *                      example: ["내가 산 물건의 poatId","asdf123"]
 *                    myPost:
 *                      type: array
 *                      example: ["내가 판 물건","도자기"]
 *                    myReview:
 *                      type: array
 *                      example: ["내가 작성한 reviewId", "asdfass"]
 *                    myMarkup:
 *                      type: array
 *                      example: ["내가 찜한 물건", "해당 postId"]
 *                    snsUrl:
 *                      type: array
 *                      example: ["인스타url", "페이스북url"]
 *
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
 *                  type: array
 *                  example: ["인스타url", "페이스북url"]
 *      responses:
 *        "200":
 */
mypageRouter.patch("/profile/update", middleware, updateProfile);

module.exports = mypageRouter;
