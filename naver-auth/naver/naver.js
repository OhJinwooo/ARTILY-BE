const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");

router.get("/naver", passport.authenticate("naver"));

const naverCallback = (req, res, next) => {
  passport.authenticate("naver", { failureRedirect: "/" }, (err, user) => {
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
    console.log(13121312312312, result);
    res.send({ user: result });
  })(req, res, next);
};
router.get("/naver/callback", naverCallback);
module.exports = router;
