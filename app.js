const express = require("express");
const app = express();
const port = 3000;

const authRouter = require("./kakao-auth/kakao/kakao");
const passportKakao = require("./kakao-auth");

const { swaggerUi, specs } = require("./swagger/swagger");

const connect = require("./schemas/index.schemas");
const testRouter = require("./routes/post.router");

const cors = require("cors");

passportKakao();
connect();
//가나다라

app.use(cors());
app.use("/oauth", authRouter);
app.use(express.json());
app.use("/api", [testRouter]);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

https: app.listen(port, () => {
  console.log(port, "서버가 연결되었습니다.");
});
