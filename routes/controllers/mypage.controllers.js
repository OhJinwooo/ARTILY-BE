const User = require("../../schemas/user.schemas");

const postProfile = async (req, res) => {
  const { user } = res.locals;
  const { profileUrl, profile, nickname, snsUrl } = req.body;
  const userId = user.userId;

  try {
    await User.updateOne(
      {
        userId,
      },
      {
        $set: {
          nickname,
          profileUrl,
          address,
          profile,
          snsUrl,
        },
      }
    );
    res.status(201).json({ success: true });
  } catch (error) {
    res.sattus(400).send("작성 실패");
  }
};

const getProfile = async (req, res) => {
  const userId = res.locals.user;
  try {
    const myprofile = await User.findOne({ userId });
    console.log(myprofile);

    res.status(200).json({ myprofile });
  } catch (err) {
    res.send(err);
  }
};

const updateProfile = async (req, res) => {
  const { user } = res.locals;
  const { nickname, profileUrl, address, profile, inquiry, snsUrl } = req.body;
  const userId = user.userId;

  try {
    await User.updateOne(
      {
        userId,
      },
      {
        $set: {
          nickname,
          profileUrl,
          address,
          profile,
          inquiry,
          snsUrl,
        },
      }
    );
    res.status(201).json({ success: true });
  } catch (error) {
    res.sattus(400).send("수정 실패");
  }
};

module.exports = {
  postProfile,
  getProfile,
  updateProfile,
};
