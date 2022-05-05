const User = require("../../schemas/user.schemas");

// 초반 프로필 설정
const postProfile = async (req, res) => {
  const { user } = res.locals;
  const { profileImage, introduce, nickname, snsUrl } = req.body;
  const userId = user.userId;

  try {
    await User.updateOne(
      {
        userId,
      },
      {
        $set: {
          nickname,
          profileImage,
          address,
          introduce,
          snsUrl,
        },
      }
    );
    res.status(201).json({ success: true });
  } catch (error) {
    res.sattus(400).send("작성 실패");
  }
};

// 프로필 조회
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

// 프로필 수정
const updateProfile = async (req, res) => {
  const { user } = res.locals;
  const { nickname, profileImage, address, introduce, snsUrl } = req.body;
  const userId = user.userId;

  try {
    await User.updateOne(
      {
        userId,
      },
      {
        $set: {
          nickname,
          profileImage,
          address,
          introduce,
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
