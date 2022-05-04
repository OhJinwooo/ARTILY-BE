const User = require("../../schemas/user.schemas");

const mypage = async (req, res) => {
  const { userId } = res.locals.user;
  try {
    const myprofile = await User.findOne({ userId });
    console.log(myprofile);

    res.status(200).json({ myprofile });
  } catch (err) {
    res.send(err);
  }
};

module.exports = {
  mypage,
};
