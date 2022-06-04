const jwt = require("jsonwebtoken");
const User = require("../schemas/user.schemas");
require("dotenv").config();

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  const [tokenType, tokenValue] = authorization.split(" ");
  if (tokenType !== "Bearer") {
    res.status(401).send({
      errorMessage: "로그인 후 이용하세요!",
    });
    return;
  }
  try {
    const { userId } = jwt.verify(tokenValue, process.env.JWTSECRETKEY);
    User.findOne({ userId })
      .exec()
      .then((user) => {
        res.locals.user = user;
        next();
      });
  } catch (error) {
    console.log(error);
    res.status(401).send({
      errorMessage: "로그인 후 이용하세요.",
    });
    return;
  }
};
