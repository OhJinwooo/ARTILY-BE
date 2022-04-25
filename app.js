const express = require("express");
const app = express();
const port = 5000;
const cors = require("cors");

const authRouter = require("./Social/kakao-auth/kakao/kakao");
const passportKakao = require("./Social/kakao-auth");
const connect = require("./schemas")


passportKakao();
connect();

app.use(cors());
app.use("/oauth", authRouter);



app.listen(port, () => {
  console.log(port, "서버가 연결되었습니다.");
});