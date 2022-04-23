const passport = require("passport");
const KakaoStrategy = require("passport-kakao").Strategy;
require("dotenv").config();
// const Users = require("../models/users");
module.exports = () => {
  passport.use(
    new KakaoStrategy(
      {
        clientID: process.env.clientID, // 카카오 로그인에서 발급받은 REST API 키
        callbackURL: "http://localhost:3000/oauth/kakao/callback", // 카카오 로그인 Redirect URI 경로
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // const exUser = await Users.findOne({
          //   // 카카오 플랫폼에서 로그인 했고 & snsId필드에 카카오 아이디가 일치할경우
          //     id: profile.id, provider: "kakao"
          // });
          // console.log(1, accessToken);
          // console.log(2, refreshToken);
          // console.log(3, profile);
          // console.log(4, done);
          const user = {
            hi: "hi",
            userId: profile.id,
            userName: profile.username,
          };
          console.log("newUser", user);
          done(null, user);
          // 이미 가입된 카카오 프로필이면 성공
          // if (exUser) {
          //   done(null, exUser); // 로그인 인증 완료
          // } else {
          //   // 가입되지 않는 유저면 회원가입 시키고 로그인을 시킨다
          //   const newNickname = Date.now();
          //   const newUser = await Users.create({
          //     nickname: newNickname.toString(),
          //     id: profile.id,
          //     provider: "kakao",
          //   });
          //   done(null, newUser); // 회원가입하고 로그인 인증 완료
          // }
        } catch (error) {
          console.error(error);
          done(error);
        }
      }
    )
  );
};