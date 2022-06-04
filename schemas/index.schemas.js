const mongoose = require("mongoose");
require("dotenv").config();
const connect = () => {
  mongoose
    .connect(process.env.MONGODBURL, {
      ignoreUndefined: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .catch((err) => {
      console.error(err);
    });
};
module.exports = connect;
