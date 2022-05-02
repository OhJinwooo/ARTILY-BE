const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");

router.post("/naver", passport.authenticate("naver"));

const naverCallback = (req, res, next) => {
  passport.authenticate("naver", { failureRedirect: "/" }, (err, user) => {
    if (err) return next(err);
    const { userId, nickname, provider, profileUrl, accessToken } = user;
    const token = jwt.sign({ userId: userId }, "ARTILY-secret-key");

    result = {
      token,
      profileUrl: profileUrl,
      userId: userId,
      nickname: nickname,
      provider: provider,
      accessToken,
      // refreshToken: refreshToken,
    };
    console.log(1, result);
    res.send({ user: result });
  })(req, res, next);
};
router.post("/naver/callback", naverCallback);
module.exports = router;
