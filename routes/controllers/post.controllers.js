const Post = require("../../schemas/post.schemas");
const { create } = require("../../schemas/user.schemas");

const getHome = async (req, res) => {
  const bestAmount = await Post.find({});

  if (bestAmount.length) {
    const postAmountSort = bestAmount.sort((a, b) => b.markupCnt - a.markupCnt);
    const bestPost = postAmountSort.splice(0, 5);
  }
  // postContent, createdAt, category, done 제거하고 res

  const attention = await user.find({});
  //   const artSort = 정렬 무슨기준? 최근 물건이 팔린 순

  const bestReview = review.find({});
  //seller, createdAt 제거 후 res

  res.json({ bestPost });
};

const test = async (req, res) => {
  const { test12 } = req.body;
  //   const tests = await Post.find({})
  const tests = await Post.create({ test12 });
  res.json({ tests });
};
module.exports = { getHome, test };
