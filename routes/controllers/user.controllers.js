// const { User } = require("../../schemas/user.schemas");
// const jwt = require("jsonwebtoken");

//사용자 인증
const user = async (req, res) => {
  const user = res.locals.user;
  res.send({
    user,
  });
};

module.exports = { user };
