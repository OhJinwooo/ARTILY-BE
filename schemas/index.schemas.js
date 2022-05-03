const mongoose = require("mongoose");
require("dotenv").config();
const connect = () => {
  mongoose
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
