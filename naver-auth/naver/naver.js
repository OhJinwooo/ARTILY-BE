const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const upload = require("../../routes/multer/uploads");
require("dotenv").config();

router.get(
  "/naver",
  upload.single("profileImage"),
  passport.authenticate("naver")
);

const naverCallback = (req, res, next) => {
  passport.authenticate("naver", { failureRedirect: "/" }, (err, user) => {
    if (err) return next(err);
    const {
      userId,
      provider,
      accessToken,
      introduce,
      profileImage,
      nickname,
      type,
    } = user;
    const token = jwt.sign({ userId: userId }, process.env.JWTSECRETKEZY);

    result = {
      token,
      userId: userId,
      provider: provider,
      accessToken,
      profileImage,
      nickname,
      introduce,
      type,
    };
    console.log(13121312312312, result);
    res.send({ user: result });
  })(req, res, next);
};
router.get("/naver/callback", naverCallback);
module.exports = router;
