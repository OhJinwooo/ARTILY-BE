const express = require("express");
const app = express();
const port = 3000;
require("dotenv").config();

const kakaoRouter = require("./kakao-auth/kakao/kakao");
const passportKakao = require("./kakao-auth");
// const naverRouter = require("./naver-auth/naver/naver");
// const passportNaver = require("./naver-auth/login");
const passport = require("passport");
const { swaggerUi, specs } = require("./swagger/swagger");

const connect = require("./schemas/index.schemas");
const postRouter = require("./routes/post.router");
const userRouter = require("./routes/user.router");

const cors = require("cors");

// passportNaver();
passportKakao();
connect();

app.use(cors());
app.use(express.json());
app.use("/oauth", [kakaoRouter]);
app.use("/api", [postRouter, userRouter]);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use(passport.initialize());
app.use(passport.session());
app.use(express.session({ secret: process.env.naverSecret }));

const client_id = process.env.naverClient_id;
const client_secret = process.env.naverSecret;
const state = "RANDOM_STATE";
const redirectURI = encodeURI("http://localhost:3000/oauth/naver/callback");
const api_url = "";
app.get("/naver", function (req, res) {
  console.log("naver 접근함");
  api_url =
    "https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=" +
    client_id +
    "&redirect_uri=" +
    redirectURI +
    "&state=" +
    state;
  res.writeHead(200, { "Content-Type": "text/html;charset=utf-8" });
  res.end(
    "<a href='" +
      api_url +
      "'><img height='50' src='http://static.nid.naver.com/oauth/small_g_in.PNG'/></a>"
  );
});
app.get("/naver/callback", function (req, res) {
  console.log("callback 접근");
  code = req.query.code;
  state = req.query.state;
  api_url =
    "https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=" +
    client_id +
    "&client_secret=" +
    client_secret +
    "&redirect_uri=" +
    redirectURI +
    "&code=" +
    code +
    "&state=" +
    state;
  var request = require("request");
  var options = {
    url: api_url,
    headers: {
      "X-Naver-Client-Id": client_id,
      "X-Naver-Client-Secret": client_secret,
    },
  };
  request.get(options, function (error, response, body) {
    console.log("get", body);
    if (!error && response.statusCode == 200) {
      console.log("if get", body);
      res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
      res.end(body);
    } else {
      console.log("else", response);
      res.status(response.statusCode).end();
      console.log("error = " + response.statusCode);
    }
  });
});

https: app.listen(port, () => {
  console.log(port, "서버가 연결되었습니다.");
});
