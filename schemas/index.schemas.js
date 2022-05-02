const mongoose = require("mongoose");

const connect = () => {
  mongoose
    // .connect("mongodb://54.180.96.227:27017/artin", {
    .connect(
      "mongodb+srv://sdnzmzm5:01040104@cluster0.ehvln.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
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

// const mongoose = require("mongoose");

// const connect = () => {
//   mongoose
//     .connect(
//       "mongodb://localhost:27017/velog",
//       // 이후 배포 시 변경 필요.
//       { ignoreUndefined: true }
//     )
//     .catch((err) => {
//       console.error(err);
//     });
// };

// module.exports = connect;
