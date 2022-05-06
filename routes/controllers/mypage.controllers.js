const User = require("../../schemas/user.schemas");
const s3 = require("../config/s3");

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
  console.log(123);
  const userId = res.locals.user;
  try {
    console.log(123456);
    const myprofile = await User.findOne({ userId });
    console.log(myprofile);

    res.status(200).json({ myprofile });
  } catch (err) {
    res.send(err);
  }
};

// 프로필 수정
const updateProfile = async (req, res) => {
  console.log(123123);
  const { user } = res.locals;
  const { nickname, address, introduce, snsUrl } = req.body;
  const userId = user.userId;
  console.log(userId);
  const profileImage = req.file?.location;
  console.log("12312", profileImage);

  try {
    if (profileImage) {
      s3.deleteObject(
        {
          Bucket: "myawsbucket",
          // Key: delFile
        },
        (err, data) => {
          if (err) {
            throw err;
          }
        }
      );
      await User.updateOne({ userId }, { $set: { profileImage } });
    } else {
      const photo = await User.find({ userId });
      const profileImage = photo[0].profileImage;
      await User.updateOne(
        {
          userId,
        },
        {
          $set: {
            nickname,
            address,
            introduce,
            profileImage,
            snsUrl,
          },
        }
      );
      res.status(201).json({ success: true });
    }
  } catch (error) {
    res.sattus(400).send("수정 실패");
  }
};

module.exports = {
  postProfile,
  getProfile,
  updateProfile,
};
