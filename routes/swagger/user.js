const userRouter = require("express").Router();
const userController = require("../controllers/user.controllers");

/**
 * @swagger
 * paths:
 *  /api/oauth/kakao/callback:
 *    get:
 *      summary: "회원가입"
 *      description: "kakao social"
 *      tags: [Users]
 *      responses:
 *        "200":
 *          description: 전체 유저 정보
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  userId:
 *                    type: string
 *                    example: "861156"
 *                  nickname:
 *                    type: string
 *                    example: "김떙떙"
 *                  role:
 *                    type: boolean
 *                    example: "true"
 *                  refreshToken:
 *                    type: string
 *                    example: "fdsafdsafdsazxvcw"
 *                  profileUrl:
 *                    type: string
 *                    example: "http://dfsafdxcv"
 *                  address:
 *                    type: string
 *                    example: "강서구 어디 어디"
 *
 */
userRouter.post("/oauth/kakao/callback");

/**
 * @swagger
 * paths:
 *  /api/user/getuser:
 *    get:
 *      summary: "사용자 정보"
 *      description: "kakao social"
 *      tags: [Users]
 *      responses:
 *        "200":
 *          description: 사용자 정보
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  userId:
 *                    type: string
 *                    example: "861156"
 *                  profileUrl:
 *                    type: string
 *                    example: "http://dfsafdxcv"
 *                  nickname:
 *                    type: string
 *                    example: "가나다"
 *                  provider:
 *                    type: string
 *                    example: "kakao"
 *                  accessToken:
 *                    type: string
 *                    example: "safjkcxvnakldsnj"
 *
 */
userRouter.post("/user/getuser");

// /**
//  * @swagger
//  * /api/user/user?user_id={user_id}:
//  *  get:
//  *    summary: "특정 유저조회 Query 방식"
//  *    description: "요청 경로에 값을 담아 서버에 보낸다."
//  *    tags: [Users]
//  *    parameters:
//  *      - in: query
//  *        name: user_id
//  *        required: true
//  *        description: 유저 아이디
//  *        schema:
//  *          type: string
//  *    responses:
//  *      "200":
//  *        description: 사용자가 서버로 전달하는 값에 따라 결과 값은 다릅니다. (유저 조회)
//  *        content:
//  *          application/json:
//  *            schema:
//  *              type: object
//  *              properties:
//  *                ok:
//  *                  type: boolean
//  *                users:
//  *                  type: object
//  *                  example: [{ "id": 1, "name": "유저1" }]
//  */
// userRouter.get("/user", userController.findOneUser1);

// /**
//  * @swagger
//  * /api/user/{user_id}:
//  *  get:
//  *    summary: "특정 유저조회 Path 방식"
//  *    description: "요청 경로에 값을 담아 서버에 보낸다."
//  *    tags: [Users]
//  *    parameters:
//  *      - in: path
//  *        name: user_id
//  *        required: true
//  *        description: 유저 아이디
//  *        schema:
//  *          type: string
//  *    responses:
//  *      "200":
//  *        description: 사용자가 서버로 전달하는 값에 따라 결과 값은 다릅니다. (유저 조회)
//  *        content:
//  *          application/json:
//  *            schema:
//  *              type: object
//  *              properties:
//  *                ok:
//  *                  type: boolean
//  *                users:
//  *                  type: object
//  *                  example: [{ "id": 1, "name": "유저1" }]
//  */
// userRouter.get("/:user_id", userController.findOneUser2);

// /**
//  * @swagger
//  *
//  * /api/user/add:
//  *  post:
//  *    summary: "유저 등록"
//  *    description: "POST 방식으로 유저를 등록한다."
//  *    tags: [Users]
//  *    requestBody:
//  *      description: 사용자가 서버로 전달하는 값에 따라 결과 값은 다릅니다. (유저 등록)
//  *      required: true
//  *      content:
//  *        application/x-www-form-urlencoded:
//  *          schema:
//  *            type: object
//  *            properties:
//  *              id:
//  *                type: integer
//  *                description: "유저 고유아이디"
//  *              name:
//  *                type: string
//  *                description: "유저 이름"
//  */
// userRouter.post("/add", userController.createUser);

// /**
//  * @swagger
//  * /api/user/update:
//  *   put:
//  *    summary: "유저 수정"
//  *    description: "PUT 방식을 통해 유저 수정(전체 데이터를 수정할 때 사용함)"
//  *    tags: [Users]
//  *    requestBody:
//  *      description: 유저 수정
//  *      required: true
//  *      content:
//  *        application/x-www-form-urlencoded:
//  *          schema:
//  *            type: object
//  *            properties:
//  *              id:
//  *                type: int
//  *                description: "유저 고유아이디"
//  *              name:
//  *                type: string
//  *                description: "유저 이름"
//  *    responses:
//  *      "200":
//  *        description: 사용자가 서버로 전달하는 값에 따라 결과 값은 다릅니다.(유저 수정)
//  *        content:
//  *          application/json:
//  *            schema:
//  *              type: object
//  *              properties:
//  *                ok:
//  *                  type: boolean
//  *                data:
//  *                  type: string
//  *                  example:
//  *                    [
//  *                      { "id": 1, "name": "유저1" },
//  *                      { "id": 2, "name": "유저2" },
//  *                      { "id": 3, "name": "유저3" },
//  *                    ]
//  */
// userRouter.put("/update", userController.setUsers);

// /**
//  * @swagger
//  * /api/user/update/{user_id}:
//  *   patch:
//  *    summary: "유저 수정"
//  *    description: "Patch 방식을 통해 특정 유저 수정(단일 데이터를 수정할 때 사용함)"
//  *    tags: [Users]
//  *    parameters:
//  *      - in: path
//  *        name: user_id
//  *        required: true
//  *        description: 유저 아이디
//  *        schema:
//  *          type: string
//  *    requestBody:
//  *      description: 유저 수정
//  *      required: true
//  *      content:
//  *        application/x-www-form-urlencoded:
//  *          schema:
//  *            type: object
//  *            properties:
//  *              name:
//  *                type: string
//  *                description: "유저 이름"
//  *    responses:
//  *      "200":
//  *        description: 사용자가 서버로 전달하는 값에 따라 결과 값은 다릅니다. (유저 수정)
//  *        content:
//  *          application/json:
//  *            schema:
//  *              type: object
//  *              properties:
//  *                ok:
//  *                  type: boolean
//  *                data:
//  *                  type: string
//  *                  example:
//  *                    [
//  *                      { "id": 1, "name": "유저1" },
//  *                      { "id": 2, "name": "유저2" },
//  *                      { "id": 3, "name": "유저3" },
//  *                    ]
//  */
// userRouter.patch("/update/:user_id", userController.setUser);

// /**
//  * @swagger
//  * /api/user/delete:
//  *   delete:
//  *    summary: "특정 유저 삭제"
//  *    description: "요청 경로에 값을 담아 서버에 보낸다."
//  *    tags: [Users]
//  *    parameters:
//  *      - in: query
//  *        name: user_id
//  *        required: true
//  *        description: 유저 아이디
//  *        schema:
//  *          type: string
//  *    responses:
//  *      "200":
//  *        description: 사용자가 서버로 전달하는 값에 따라 결과 값은 다릅니다. (유저 삭제)
//  *        content:
//  *          application/json:
//  *            schema:
//  *              type: object
//  *              properties:
//  *                ok:
//  *                  type: boolean
//  *                users:
//  *                  type: object
//  *                  example:
//  *                    [
//  *                      { "id": 1, "name": "유저1" },
//  *                      { "id": 2, "name": "유저2" },
//  *                      { "id": 3, "name": "유저3" },
//  *                    ]
//  */
// userRouter.delete("/delete", userController.delUser);

module.exports = userRouter;
