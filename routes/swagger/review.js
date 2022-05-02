const reviewRouter = require("express").Router();

/**
 * @swagger
 * paths:
 *  /api/review:
 *    get:
 *      summary: "리뷰 조회"
 *      description: "서버에 데이터를 보내지 않고 Get방식으로 요청"
 *      tags: [Review]
 *      responses:
 *        "200":
 *          description:
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                    category:
 *                      type: string
 *                      example: "도자"
 *                    reviewId:
 *                      type: string
 *                      example: "asdf"
 *                    userId:
 *                      type: string
 *                      example: "abc123"
 *                    nickname:
 *                      type: string
 *                      example: "커피조아"
 *                    reviewTitle:
 *                      type: string
 *                      example: "도자기 너무 예뻐요~!"
 *                    reviewContent:
 *                      type: string
 *                      example: "인테리어용으로 주문했는데 생각보다 더 예뻐서 놀랐어요!"
 *                    likeCnt:
 *                      type: number
 *                      example: 3
 *                    imageUrl:
 *                      type: array
 *                      example: ["asdf","wert","dfgh"]
 */
reviewRouter.get("/review", review);

/**
 * @swagger
 * paths:
 *  /api/review/{reviewId}:
 *    get:
 *      summary: "리뷰 상세조회"
 *      description: "서버에 파라미터로 reveiwid를 보내고 get방식으로 요청 "
 *      tags: [Review]
 *      parameters:
 *        - in: path
 *          name: reviewId
 *          required: true
 *          description: 리뷰 아이디
 *          schema:
 *            type: string
 *      responses:
 *      "200":
 *        description:
 *        content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  reviewId:
 *                    type: string
 *                    example: "asdf"
 *                  userId:
 *                    type: string
 *                    example: "abc123"
 *                  nickname:
 *                    type: string
 *                    example: "커피조아"
 *                  reviewTitle:
 *                    type: string
 *                    example: "도자기 너무 예뻐요~!"
 *                  reviewContent:
 *                    type: String
 *                    example: "선물받은 친구가 좋아했어요 : )"
 *                  likeCnt:
 *                    type: Number
 *                    example: 6
 *                  imageUrl:
 *                    type: array
 *                    example: ["1412214", "7678"]
 *                  seller:
 *                    type: object
 *                    properties:
 *                        postId:
 *                          type: string
 *                          example: "asdfsdf"
 *                        postTitle:
 *                          type: string
 *                          example: "포스터 팔아요~"
 *                        price:
 *                          type: Number
 *                          example: 3000
 *                        imageUrl:
 *                          type: array
 *                          example: ["1412214", "7678"]
 *                        userId:
 *                          type: string
 *                          example: "qwer"
 *                        nickname:
 *                          type: string
 *                          example: "조리퐁소녀"
 *                        profileUrl:
 *                          type: string
 *                          example: "asdfasdf"
 *
 *                  defferent:
 *                    type: array
 *                    items:
 *                      type: object
 *                      properties:
 *                                postId:
 *                                  type: string
 *                                  example: "asdfsdf"
 *                                postTitle:
 *                                  type: string
 *                                  example: "포스터 팔아요~"
 *                                price:
 *                                  type: Number
 *                                  example: 3000
 *                                imageUrl:
 *                                  type: array
 *                                  example: ["1412214", "7678"]
 *                                userId:
 *                                  type: string
 *                                  example: "qwer"
 */
reviewRouter.post("/review", upload.single("imageUrl"), review_write);

/**
 * @swagger
 *
 * api/review:
 *  post:
 *    summary: "리뷰 작성"
 *    description: "리뷰 작성"
 *    tags: [Review]
 *    requestBody:
 *      description:
 *      required: true
 *      content:
 *        application/x-www-form-urlencoded:
 *          schema:
 *            type: object
 *            properties:
 *              category:
 *                type: string
 *                example: "도자"
 *              userId:
 *                type: string
 *                example: "asdfsdf"
 *              nickname:
 *                type: string
 *                example: "병아리"
 *              reviewTitle:
 *                type: string
 *                example: "도자기 장인 인정"
 *              reviewContent:
 *                type: string
 *                example: "도자기 이렇게 예쁠일?🧡"
 *              likeCnt:
 *                type: Number
 *                example: 3
 */
reviewRouter.post("/review", upload.single("imageUrl"), review_write);

// /**
//  * @swagger
//  * /api/review/{reviewId}
//  *   patch:
//  *    summary: "리뷰 수정"
//  *    description: "Patch 방식을 통해 특정 리뷰 수정(단일 데이터를 수정할 때 사용함)"
//  *    tags: [Review]
//  *    parameters:
//  *      - in: path
//  *        name: reviewId
//  *        required: true
//  *        description: 리뷰 아이디
//  *        schema:
//  *          type: string
//  *    requestBody:
//  *      description: 리뷰 수정
//  *      required: true
//  *      content:
//  *        application/x-www-form-urlencoded:
//  *          schema:
//  *            type: object
//  *            properties:
//  *              category:
//  *                type: string
//  *                example: "도자"
//  *              reviewTitle:
//  *                type: string
//  *                example: "도자기 잘샀어요!"
//  *              reviewContent:
//  *                type: string
//  *                example: "둥근모양이 아름답네요"
//  *              imageUrl:
//  *                type: array
//  *                example: ["1412214", "7678"]
//  *    responses:
//  *      "200":
//  *        description: 사용자가 수정하고자 하는 값만 수정된다.
//  *        content:
//  *          application/json:
//  *            schema:
//  *              type: object
//  *              properties:
//  *                ok:
//  *                  type: boolean
//  */
reviewRouter.patch(
  "/review/:reviewId",
  upload.single("imageUrl"),
  review_modify
);

// /**
//  * @swagger
//  * /api/review/delete:
//  *   delete:
//  *    summary: "특정 리뷰 삭제"
//  *    description: "요청 경로에 값을 담아 서버에 보낸다."
//  *    tags: [Review]
//  *    parameters:
//  *      - in: query
//  *        name: reveiwId
//  *        required: true
//  *        description: 리뷰 아이디
//  *        schema:
//  *          type: string
//  *    responses:
//  *      "200":
//  *        description: 사용자가 서버로 전달하는 값에 따라 결과 값은 다릅니다. (리뷰 삭제)
//  *        content:
//  *          application/json:
//  *            schema:
//  *              type: object
//  *              properties:
//  *                ok:
//  *                  type: boolean
//  */
reviewRouter.delete("/review/:reviewId", review_delete);

module.exports = reviewRouter;
