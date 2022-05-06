const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const upload = require("../../routes/multer/uploads");

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
    const token = jwt.sign({ userId: userId }, "ARTILY-secret-key");

    result = {
      token,
      userId: userId,
      provider: provider,
      accessToken,
      profileImage,
      nickname,
      introduce,
      type,
      // refreshToken: refreshToken,
    };
    console.log(13121312312312, result);
    res.send({ user: result });
  })(req, res, next);
};
router.get("/naver/callback", naverCallback);
module.exports = router;
