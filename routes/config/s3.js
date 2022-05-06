<<<<<<< HEAD
const AWS = require("aws-sdk");
require("dotenv").config();

=======
// s3.js
const AWS = require("aws-sdk");
require("dotenv").config();
>>>>>>> c81b786fe81dbfbade7b32724c2be4703fed6589
const s3 = new AWS.S3({
  accessKeyId: process.env.accessKeyId,
  secretAccessKey: process.env.secretAccessKey,
  region: process.env.region,
});
<<<<<<< HEAD

=======
>>>>>>> c81b786fe81dbfbade7b32724c2be4703fed6589
module.exports = s3;
