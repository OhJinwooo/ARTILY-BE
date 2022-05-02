const aws = require('aws-sdk');
aws.config.loadFromPath(__dirname + '../../awsconfig.json');
const s3 = new aws.S3({});

module.exports = s3