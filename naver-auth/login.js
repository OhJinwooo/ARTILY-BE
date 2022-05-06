const passport = require("passport"); //passport 추가
const NaverStrategy = require("passport-naver").Strategy;
const User = require("../schemas/user.schemas");
require("dotenv").config();

//별도 config 파일에 '네아로'에 신청한 정보 입력
module.exports = () => {
  console.log("모듈");
  passport.use(
    new NaverStrategy(
      {
        clientID: process.env.NAVERCLIENT_ID,
        clientSecret: process.env.NAVERSECRET,
        callbackURL: "http://localhost:3000/oauth/naver/callback",
      },

      async (accessToken, refreshToken, profile, done) => {
        console.log("NaverStrategy");
        try {
          console.log("try in", profile);
          const exUser = await User.findOne({
            userId: profile.id,
            provider: "naver",
          });
          // clientID에 카카오 앱 아이디 추가
          // callbackURL: 카카오 로그인 후 카카오가 결과를 전송해줄 URL
          // accessToken, refreshToken : 로그인 성공 후 카카오가 보내준 토큰
          // profile: 카카오가 보내준 유저 정보. profile의 정보를 바탕으로 회원가입

          let profileImage = "";
          let nickname = "";
          let address = "";
          let introduce = "";
          let role = true;
          if (exUser) {
            console.log("로그인", exUser);
            done(null, exUser);
          } else {
            if (profile._json.profile_image) {
              profileImage = profile._json.profile_image;
            }

            const user = {
              refreshToken: refreshToken,
              accessToken: accessToken,
              userId: profile.id,
              provider: "naver",
              profileImage,
              nickname,
              address,
              type: "new",
              introduce,
              role,
            };
            await User.create(user);
            done(null, user);
          }
        } catch {
          console.error(error);
          done(error);
        }
      }
    )
  );
};
