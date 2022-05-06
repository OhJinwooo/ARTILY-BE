const User = require("../../schemas/user.schemas");
const s3 = require("../config/s3");

// 초반 프로필 설정
const postProfile = async (req, res) => {
  const { user } = res.locals;
  const userId = user.userId;

  const { introduce, nickname, snsUrl, address } = req.body;

  const profileImage = req.file?.location;
  console.log("profileImage", profileImage);

  // try {
  const photo = await User.find({ userId });
  // console.log("photo", photo);
  const url = photo[0].profileImage.split("/");
  // console.log("url", url);
  const delFileName = url[url.length - 1];
  // console.log("delFileName", delFileName);

  if (profileImage) {
    console.log("이미지 있음");
    s3.deleteObject(
      {
        Bucket: "myawsbukets",
        Key: delFileName,
      },
      (err, data) => {
        if (err) {
          throw err;
        }
      }
    );
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
          type: "member",
        },
      }
    );
  } else {
    console.log("이미지 없음");
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
          type: "member",
        },
      }
    );
  }
  res.status(201).json({ success: true });
  // } catch (error) {
  //   res.status(400).send("작성 실패");
  // }
};

// 프로필 조회
const getProfile = async (req, res) => {
<<<<<<< HEAD
  console.log(123);
=======
>>>>>>> sungbin
  const { userId } = res.locals.user;
  try {
    console.log("try");
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
