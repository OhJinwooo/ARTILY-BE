const passport = require("passport"); //passport 추가
const NaverStrategy = require("passport-naver").Strategy;
const User = require("../schemas/user.schemas");
require("dotenv").config();

//별도 config 파일에 '네아로'에 신청한 정보 입력
passport.use(
  new NaverStrategy(
    {
      clientID: config.authLogin.naver.client_id,
      clientSecret: config.authLogin.naver.secret_id,
      callbackURL: config.authLogin.naver.callback_url,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const exUser = await User.findOne({
          userId: profile.id,
          provider: "naver",
        });
        // clientID에 카카오 앱 아이디 추가
        // callbackURL: 카카오 로그인 후 카카오가 결과를 전송해줄 URL
        // accessToken, refreshToken : 로그인 성공 후 카카오가 보내준 토큰
        // profile: 카카오가 보내준 유저 정보. profile의 정보를 바탕으로 회원가입

        let profileUrl = "";
        if (exUser) {
          console.log("로그인", exUser);
          done(null, exUser);
        } else {
          if (profile._json.profile_image) {
            profileUrl = profile._json.profile_image;
          }

          const user = {
            refreshToken: refreshToken,
            accessToken: accessToken,
            nickname: profile.displayName, // 이름
            userId: profile.id,
            provider: "naver",
            profileUrl,
            // email: profile.emails[0].value, // 유저 이메일
          };
          await User.create(user);

          console.log("user=");
          console.log(user);
          return done(null, user);
        }
      } catch {
        console.error(error);
        done(error);
      }
    }
  )
);
//failed to serialize user into session 에러 발생 시 아래의 내용을 추가 한다.
// passport.serializeUser(function (user, done) {
//   done(null, user);
// });
// passport.deserializeUser(function (req, user, done) {
//   // passport로 로그인 처리 후 해당 정보를 session에 담는다.
//   req.session.sid = user.name;
//   console.log("Session Check :" + req.session.sid);
//   done(null, user);
// });

// // 네이버 로그인 Node.js 예제는 1개의 파일로 로그인요청 및 콜백 처리를 모두합니다.
// const express = require("express");
// const router = express.Router();
// const client_id = "O0fsBqZpK6pDP7BSI_uR";
// const client_secret = "HGhAH2qc7m";
// const state = "RANDOM_STATE";
// const redirectURI = encodeURI("http://localhost:5500/naverCallback.html");
// const api_url = "";
// router.get("/naverlogin", function (req, res) {
//   api_url =
//     "https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=" +
//     client_id +
//     "&redirect_uri=" +
//     redirectURI +
//     "&state=" +
//     state;
//   res.writeHead(200, { "Content-Type": "text/html;charset=utf-8" });
//   res.end(
//     "<a href='" +
//       api_url +
//       "'><img height='50' src='http://static.nid.naver.com/oauth/small_g_in.PNG'/></a>"
//   );
// });
// router.get("/callback", function (req, res) {
//   code = req.query.code;
//   state = req.query.state;
//   api_url =
//     "https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=" +
//     client_id +
//     "&client_secret=" +
//     client_secret +
//     "&redirect_uri=" +
//     redirectURI +
//     "&code=" +
//     code +
//     "&state=" +
//     state;
//   var request = require("request");
//   var options = {
//     url: api_url,
//     headers: {
//       "X-Naver-Client-Id": client_id,
//       "X-Naver-Client-Secret": client_secret,
//     },
//   };
//   request.get(options, function (error, response, body) {
//     if (!error && response.statusCode == 200) {
//       res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
//       res.end(body);
//     } else {
//       res.status(response.statusCode).end();
//       console.log("error = " + response.statusCode);
//     }
//   });
// });
// router.listen(3000, function () {
//   console.log("http://127.0.0.1:3000/naverlogin app listening on port 3000!");
// });
