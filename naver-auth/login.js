require("dotenv").config();
const passport = require("passport"); //passport 추가
const NaverStrategy = require("passport-naver").Strategy;
const User = require("../schemas/user.schemas");

module.exports = () => {
  passport.use(
    new NaverStrategy(
      {
        clientID: process.env.NAVERCLIENT_ID,
        clientSecret: process.env.NAVERSECRET,
        callbackURL: process.env.NAVERCALLBACKURL,
      },

      async (accessToken, refreshToken, profile, done) => {
        try {
          console.log("try in", profile);
          const exUser = await User.findOne({
            userId: profile.id,
            provider: "naver",
          });

          let profileImage = "";
          let nickname = "";
          let address = "";
          let introduce = "";
          let role = true;
          if (exUser) {
            console.log("로그인", exUser);
            return done(null, exUser);
          } else {
            const user = {
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
            return done(null, user);
          }
        } catch {
          console.error(error);
          done(error);
        }
      }
    )
  );
};
