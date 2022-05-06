// s3.js
const AWS = require("aws-sdk");
require("dotenv").config();
const s3 = new AWS.S3({
  accessKeyId: process.env.accessKeyId,
  secretAccessKey: process.env.secretAccessKey,
  region: process.env.region,
});
module.exports = s3;
