// 로컬 테스트
// const mongoose = require("mongoose");
// require("dotenv").config();
// const connect = () => {
//   mongoose
//     .connect("mongodb://localhost:27017/artin", {
//       //.connect(process.env.MongoDBUrl, {
//       ignoreUndefined: true,
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     })
//     .catch((err) => {
//       console.error(err);
//     });
// };
// module.exports = connect;

const mongoose = require("mongoose");
require("dotenv").config();
const connect = () => {
  mongoose
    // .connect("mongodb://54.180.96.227:27017/artin", {
    .connect(
      "mongodb+srv://sdnzmzm5:01040104@cluster0.ehvln.mongodb.net/ARTILY?retryWrites=true&w=majority",
      {
        ignoreUndefined: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    )
    .catch((err) => {
      console.error(err);
    });
};
module.exports = connect;
