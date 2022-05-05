const postRouter = require("express").Router();
// const postController = require("../controllers/review.controllers");

/**
 * @swagger
 * paths:
 *  /api/post:
 *    get:
 *      summary: "홈 조회"
 *      description: "bsetPost 찜순(4개), attention 랜덤 (4개), bestReview 좋아요순(4개)"
 *      tags: [Post]
 *      responses:
 *        "200":
 *          description: 전체 유저 정보
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  bestPost:
 *                    type: array
 *                    items:
 *                      type: object
 *                      properties:
 *                         postId:
 *                           type: string
 *                           example: "1412214"
 *                         postTitle:
 *                           type: string
 *                           example: "작품 팔아요"
 *                         price:
 *                           type: number
 *                           example: 1412214
 *                         transaction:
 *                           type: string
 *                           example: "직거래 / 택배"
 *                         changeAddress:
 *                           type: string
 *                           example: "서울 어디 어디"
 *                         markupCnt:
 *                           type: number
 *                           example: 99
 *                         imageUrl:
 *                           type: array
 *                           example: ["1412214", "7678"]
 *                         user:
 *                           type: object
 *                           properties:
 *                              userId:
 *                                type: string
 *                                example: "412412421"
 *                              nickname:
 *                                type: string
 *                                example: "김땡땡"
 *                              address:
 *                                type: string
 *                                example: "서울 어디 어디"
 *                              profileUrl:
 *                                type: string
 *                                example: "SALHFKDSNAVFKL"
 *                              profile:
 *                                type: string
 *                                example: "전공, 경력"
 *                  attention:
 *                    type: array
 *                    items:
 *                      type: object
 *                      properties:
 *                        userId:
 *                          type: string
 *                          example: "12356"
 *                        nickname:
 *                          type: string
 *                          example: "김땡땡"
 *                        profileUrl:
 *                          type: string
 *                          example: "SALHFKDSNAVFKL"
 *                        profile:
 *                          type: string
 *                          example: "전공, 경력"
 *                        postCnt:
 *                          type: number
 *                          example: "16"
 *                        category:
 *                          type: string
 *                          example: "그림"
 *
 *                  bestReview:
 *                    type: array
 *                    items:
 *                      type: object
 *                      properties:
 *                        reviewId:
 *                          type: string
 *                          example: "312543"
 *                        userId:
 *                          type: string
 *                          example: "312543"
 *                        nickname:
 *                          type: string
 *                          example: "김땡땡"
 *                        reviewTitle:
 *                          type: string
 *                          example: "잘 받았습니다!"
 *                        reviewContent:
 *                          type: string
 *                          example: "받았습니다"
 *                        likeCnt:
 *                          type: number
 *                          example: "33"
 *                        imageUrl:
 *                          type: array
 *                          example: ["312543", "765556"]
 *
 *
 *
 *
 *
 */
postRouter.get("/post");
/**
 * @swagger
 * /api/post/{category}:
 *  get:
 *    summary: 스토어 조회
 *    description: "params category"
 *    tags: [Post]
 *    parameters:
 *      - in: query
 *        name: category
 *        required: true
 *        description: category
 *        schema:
 *          type: string
 *    responses:
 *      "200":
 *        description: 성공
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                category:
 *                  type: string
 *                  example: "그림"
 *                postId:
 *                  type: string
 *                  example: "312543"
 *                postTitle:
 *                  type: string
 *                  example: "이거 이뻐요"
 *                price:
 *                  type: number
 *                  example: 9000
 *                transaction:
 *                  type: string
 *                  example: "직거래 / 택배"
 *                changeAddress:
 *                  type: string
 *                  example: "서울 어디 어디"
 *                markupCnt:
 *                  type: number
 *                  example: "33"
 *                imageUrl:
 *                  type: array
 *                  example: ["312543", "765556"]
 *                user:
 *                  type: object
 *                  properties:
 *                    userId:
 *                      type: string
 *                      example: "124124"
 *                    nickname:
 *                      type: string
 *                      example: "김땡땡"
 *                    profileUrl:
 *                      type: string
 *                      example: "http://thkslds"
 *                    address:
 *                      type: string
 *                      example: "서울 어디 어디"
 */
postRouter.get("/post/:category");

/**
 * @swagger
 * /api/post/{postId}:
 *  get:
 *    summary: 판매 게시글 상세 조회
 *    description: "params postId"
 *    tags: [Post]
 *    parameters:
 *      - in: query
 *        name: postId
 *        required: true
 *        description: postId
 *        schema:
 *          type: string
 *    responses:
 *      "200":
 *        description: 성공
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                 postId:
 *                   type: string
 *                 postTitle:
 *                   type: string
 *                 postContent:
 *                   type: string
 *                 createdAt :
 *                   type: string
 *                 price:
 *                   type: number
 *                 category:
 *                   type: string
 *                 transaction:
 *                   type: string
 *                 postSize:
 *                   type: string
 *                 user :
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                     nickname:
 *                       type: string
 *                     profileUrl:
 *                       type: string
 *                     address:
 *                       type: string
 *                     profile:
 *                       type: string
 *                 changeAddress:
 *                   type: string
 *                 imageUrl:
 *                   type: string
 *                 done:
 *                   type: boolean
 *                 markupCnt:
 *                   type: number
 */
postRouter.get("/post/:postId");

/**
 * @swagger
 *
 * /api/post:
 *  post:
 *    summary: "판매글 작성"
 *    description: "판매글 작성"
 *    tags: [Post]
 *    requestBody:
 *      description:
 *      required: true
 *      content:
 *        application/x-www-form-urlencoded:
 *          schema:
 *            type: object
 *            properties:
 *              postId:
 *                type: string
 *                example: "124434"
 *              postTitle:
 *                type: string
 *                example: "이 제품 좋아요"
 *              postContent:
 *                type: string
 *                example: "42"
 *              createdAt:
 *                type: string
 *                example: "2022-04-04 12:30:30"
 *              price:
 *                type: number
 *                example: "9900"
 *              category:
 *                type: string
 *                example: "그림"
 *              transaction:
 *                type: string
 *                example: "직거래"
 *              user :
 *                type: object
 *                properties:
 *                  userId:
 *                    type: string
 *                    example: "124421"
 *                  nickname:
 *                    type: string
 *                    example: "가나다"
 *                  profileUrl:
 *                    type: string
 *                    example: "http://fdsfs"
 *                  address:
 *                    type: string
 *                    example: "강서구"
 *                  profile:
 *                    type: string
 *                    example: "전공/ 경력"
 *              changeAddress:
 *                type: string
 *                example: "강서구"
 *              imageUrl:
 *                type: string
 *                example: "imageUrl"
 *              done:
 *                type: boolean
 *                example: true
 *              markupCnt:
 *                type: number
 *                example: "12"
 */
postRouter.post("/post");

/**
 * @swagger
 * /api/post/update/{postId}:
 *   patch:
 *    summary: "post 수정"
 *    description: "Patch 방식을 통해 특정 post 수정(단일 데이터를 수정할 때 사용함)"
 *    tags: [Post]
 *    parameters:
 *      - in: path
 *        name: postId
 *        required: true
 *        description: post 아이디
 *        schema:
 *          type: string
 *    requestBody:
 *      description: post 수정
 *      required: true
 *      content:
 *        application/x-www-form-urlencoded:
 *          schema:
 *            type: object
 *            properties:
 *              postId:
 *                type: string
 *                example: "1242143"
 *              postTitle:
 *                type: string
 *                example: "이 제품 좋아요"
 *              postContent:
 *                type: string
 *                example: "42"
 *              price:
 *                type: number
 *                example: "9900"
 *              category:
 *                type: string
 *                example: "그림"
 *              transaction:
 *                type: string
 *                example: "직거래"
 *              changeAddress:
 *                type: string
 *                example: "강서구"
 *              imageUrl:
 *                type: string
 *                example: "imageUrl"
 *    responses:
 *      "200":
 *        description: 사용자가 서버로 전달하는 값에 따라 결과 값은 다릅니다. (post 수정)
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                postId:
 *                  type: string
 *                  example: "1242143"
 *                postTitle:
 *                  type: string
 *                  example: "이 제품 좋아요"
 *                postContent:
 *                  type: string
 *                  example: "42"
 *                price:
 *                  type: number
 *                  example: "9900"
 *                category:
 *                  type: string
 *                  example: "그림"
 *                transaction:
 *                  type: string
 *                  example: "직거래"
 *                changeAddress:
 *                  type: string
 *                  example: "강서구"
 *                imageUrl:
 *                  type: string
 *                  example: "imageUrl"
 */
postRouter.patch("/update/:user_id");

/**
 * @swagger
 * /api/post/delete/{postId}:
 *   delete:
 *    summary: "특정 post 삭제"
 *    description: "요청 경로에 값을 담아 서버에 보낸다."
 *    tags: [Post]
 *    parameters:
 *      - in: query
 *        name: postId
 *        required: true
 *        description: post 아이디
 *        schema:
 *          type: string
 *    responses:
 *      "200":
 *        description: 사용자가 서버로 전달하는 값에 따라 결과 값은 다릅니다. (post 삭제)
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                postId:
 *                  type: string
 *                  example: "5133"
 */
postRouter.delete("/delete");

module.exports = postRouter;
