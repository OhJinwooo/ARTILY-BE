const passport = require("passport");
const KakaoStrategy = require("passport-kakao").Strategy;
const User = require("../schemas/user.schemas");
require("dotenv").config();

module.exports = () => {
  passport.use(
    new KakaoStrategy(
      {
        clientID: process.env.KAKAOCLIENT_ID, // 카카오 로그인에서 발급받은 REST API 키
        callbackURL: "http://localhost:3000/oauth/kakao/callback", // 카카오 로그인 Redirect URI 경로
      },

      async (accessToken, refreshToken, profile, done) => {
        try {
          console.log(profile);
          const exUser = await User.findOne({
            // 카카오 플랫폼에서 로그인 했고 & snsId필드에 카카오 아이디가 일치할경우
            userId: profile.id,
            provider: "kakao",
          });
          // clientID에 카카오 앱 아이디 추가
          // callbackURL: 카카오 로그인 후 카카오가 결과를 전송해줄 URL
          // accessToken, refreshToken : 로그인 성공 후 카카오가 보내준 토큰
          // profile: 카카오가 보내준 유저 정보. profile의 정보를 바탕으로 회원가입

          let profileUrl = "";
          let address = "";
          if (exUser) {
            console.log(99999999999, exUser);
            done(null, exUser); // 로그인 인증 완료
          } else {
            if (profile._json.properties?.profile_image) {
              profileUrl = profile._json.properties?.profile_image;
            }

            console.log("@@@@@@@@@@@@@@@@", process.env.KAKAOCLIENT_ID);
            const user = {
              accessToken: accessToken,
              refreshToken: refreshToken,
              nickname: profile.username,
              userId: profile.id,
              provider: "kakao",
              profileUrl,
              address,
            };
            // 가입되지 않는 유저면 회원가입 시키고 로그인을 시킨다
            await User.create(user);
            done(null, user); // 회원가입하고 로그인 인증 완료
          }
        } catch (error) {
          console.error(error);
          done(error);
        }
      }
    )
  );
};
