const mongoose = require("mongoose");
require("dotenv").config();

const connect = () => {
  mongoose
<<<<<<< HEAD

    .connect("mongodb://localhost:27017/artin", {
      //.connect(process.env.MongoDBUrl, {
      ignoreUndefined: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
=======
    // .connect("mongodb://54.180.96.227:27017/artin", {
    .connect(
      "mongodb+srv://sdnzmzm5:01040104@cluster0.ehvln.mongodb.net/ARTILY?retryWrites=true&w=majority",
      {
        ignoreUndefined: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    )
>>>>>>> 1c8cb350c73f63cac638ff7901355d1fc95bbf40

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
