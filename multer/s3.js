const aws = require('aws-sdk');
/* aws.config.loadFromPath(__dirname + '../../awsconfig.json'); */
aws.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION 
});
const s3 = new aws.S3();

module.exports = s3