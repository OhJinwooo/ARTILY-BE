const mongoose = require("mongoose");

const connect = () => {
  mongoose
    .connect("mongodb://localhost:27017/artin", {
      ignoreUndefined: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

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
