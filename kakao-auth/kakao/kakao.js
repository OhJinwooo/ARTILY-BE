require("dotenv").config();
const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const upload = require("../../routes/multer/uploads");

router.get(
  "/kakao",
  upload.single("profileImage"),
  passport.authenticate("kakao")
);

const kakaoCallback = (req, res, next) => {
  passport.authenticate("kakao", { failureRedirect: "/" }, (err, user) => {
    if (err) return next(err);
    const { userId, provider, introduce, profileImage, nickname, type } = user;
    const token = jwt.sign({ userId: userId }, process.env.JWTSECRETKEY);

    result = {
      token,
      userId,
      provider,
      profileImage,
      nickname,
      introduce,
      type,
    };
    console.log(1, result);
    res.send({ user: result });
  })(req, res, next);
};
router.get("/kakao/callback", kakaoCallback);
module.exports = router;
