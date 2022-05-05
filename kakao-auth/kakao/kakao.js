const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");

router.get(
  "/kakao",
  upload.single("profileImage"),
  passport.authenticate("kakao")
);

const kakaoCallback = (req, res, next) => {
  passport.authenticate("kakao", { failureRedirect: "/" }, (err, user) => {
    if (err) return next(err);
    const { userId, nickname, provider, profileImage, accessToken, introduce } =
      user;
    const token = jwt.sign({ userId: userId }, "ARTILY-secret-key");

    result = {
      token,
      profileImage: profileImage,
      userId: userId,
      nickname: nickname,
      provider: provider,
      accessToken,
      introduce,
      // refreshToken: refreshToken,
    };
    console.log(1, result);
    res.send({ user: result });
  })(req, res, next);
};
router.get("/kakao/callback", kakaoCallback);
module.exports = router;
