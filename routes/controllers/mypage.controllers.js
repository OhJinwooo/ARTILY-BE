const User = require("../../schemas/user.schemas");

const mypage = async (req, res) => {
  const userId = res.locals.user;
  try {
    const myprofile = await User.findOne({ userId });
    console.log(myprofile);

    res.status(200).json({ myprofile });
  } catch (err) {
    res.send(err);
  }
};

const mypageUpdate = async (req, res) => {
  const user = res.locals.user;
  const { nickname, profileUrl, address, profile, inquiry, snsUrl } = req.body;
  const userId = user.userId;
  // const myprofile = await User.findOne({ userId });
  console.log(123, userId);

  // if (!myprofile.length) {
  //   return res
  //     .status(400)
  //     .json({ success: false, errorMessage: "해당 프로필이 없습니다." });
  // }

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
  mypage,
  mypageUpdate,
};

// 장바구니 수정
// const editCart = async (req, res) => {
//   const { user } = res.locals;
//   const userId = user[0].userId;
//   const { itemId, itemAmount, itemPrice } = req.body;
//   try {
//     await User.updateOne(
//       { userId: userId, "userCart.itemId": itemId },
//       {
//         $set: {
//           "userCart.$.itemAmount": itemAmount,
//           "userCart.$.itemPrice": itemPrice,
//         },
//       }
//     );
//     res.status(201).send("장바구니가 수정되었습니다.");
//   } catch (error) {
//     res.status(400).send("실패했습니다.");
//   }
// };
