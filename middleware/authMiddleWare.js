const jwt = require("jsonwebtoken");
const User = require("../schemas/user.schemas");

module.exports = (req, res, next) => {
  //헤더의 이름 authorization 은 프론트와 얘기해야 함.
  const { authorization } = req.headers;
  const [tokenType, tokenValue] = authorization.split(" ");
  if (tokenType !== "Bearer") {
    res.status(401).send({
      errorMessage: "로그인 후 이용하세요!",
    });
    return;
  }
  try {
    const { userId } = jwt.verify(tokenValue, "ARTILY-secret-key");
    User.findOne({ userId })
      .exec()
      .then((user) => {
        res.locals.user = user;
        next();
      });
  } catch (error) {
    res.status(401).send({
      errorMessage: "로그인 후 이용하세요.",
    });
    return;
  }
};
