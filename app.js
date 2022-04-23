const express = require("express");
const app = express();
const port = 5000;
const cors = require("cors");

const authRouter = require("./passport/kakao/kakao");
const passportKakao = require("./passport");
const gitHub = require("./auth/github")


passportKakao();
gitHub()


app.use(cors());
app.use("/oauth", authRouter);


app.listen(port, () => {
  console.log(port, "서버가 연결되었습니다.");
});