require("dotenv").config();
const passport = require("passport");
const KakaoStrategy = require("passport-kakao").Strategy;
const User = require("../schemas/user.schemas");

module.exports = () => {
  passport.use(
    new KakaoStrategy(
      {
        clientID: process.env.KAKAOCLIENT_ID,
        clientSecret: process.env.KAKAOSECRET,
        callbackURL: process.env.KAKAOCALLBACKURL,
      },

      async (accessToken, refreshToken, profile, done) => {
        try {
          const exUser = await User.findOne({
            userId: profile.id,
            provider: "kakao",
          });

          let profileImage = "";
          let nickname = "";
          let address = "";
          let introduce = "";
          let role = true;
          if (exUser) {
            return done(null, exUser); // 로그인 인증 완료
          } else {
            const user = {
              userId: profile.id,
              provider: "kakao",
              profileImage,
              nickname,
              type: "new",
              address,
              introduce,
              role,
            };
            await User.create(user);
            return done(null, user);
          }
        } catch (error) {
          console.error(error);
          return done(error);
        }
      }
    )
  );
};
