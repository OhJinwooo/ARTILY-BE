const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");

router.get("/kakao", passport.authenticate("kakao"));

const kakaoCallback = (req, res, next) => {
  passport.authenticate("kakao", { failureRedirect: "/" }, (err, user) => {
    if (err) return next(err);
    const { userId, nickname, provider, profileUrl } = user;
    // console.log(123, userId, nickname, provider, profileUrl);
    const token = jwt.sign({ userId: userId }, "kakao-secret-key");

    result = {
      token,
      profileUrl: profileUrl,
      userId: userId,
      nickname: nickname,
      provider: provider,
      // refreshToken: refreshToken,
    };
    console.log(1, result); // 배포하자마자 연경님 정보 찍힘
    res.send({ user: result });
  })(req, res, next);
};
router.get("/kakao/callback", kakaoCallback);
module.exports = router;

// const express = require("express");
// const router = express.Router();
// const passport = require("passport");
// const jwt = require("jsonwebtoken");

// router.get("/kakao", passport.authenticate("kakao"));

// const kakaoCallback = (req, res, next) => {
//   passport.authenticate(
//     "kakao",
//     { failureRedirect: "/" },
//     (err, user, info) => {
//       if (err) return next(err);
//       console.log("콜백~~~");
//       const { userId, nickname } = user;
//       const token = jwt.sign({ userId: userId }, "velog-secret-key");

//       result = {
//         token,
//         userId: userId,
//         nickname: nickname,
//       };
//       console.log(result);
//       res.send({ user: result });
//     }
//   )(req, res, next);
// };
// router.get("/kakao/callback", kakaoCallback);
// module.exports = router;
