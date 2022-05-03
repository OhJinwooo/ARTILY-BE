/* const multer = require('multer');
const path = require('path') 
const fs =require('fs');

 try {
    fs.readdirSync('uploads'); // 폴더 확인
    } catch(err) {
    console.error('uploads 폴더가 없습니다. 폴더를 생성합니다.');
    fs.mkdirSync('uploads'); // 폴더 생성
    } 
    
   const storage = multer.diskStorage({
      //파일 경로 지정
      destination:  (req, file, cb) => {
        cb(null, 'uploads/')
      },
      //파일이름 생성
      filename:  (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname.split(" ").join('_'))// 파일 원본이름 저장
      }
    }); 
    // upload를 변수 선언 multer(옵션지정)
     const upload = multer({ storage: storage }); 
     module.exports = upload  */

const multer = require('multer'); 
const multerS3 = require('multer-s3'); 
const s3 = require('../multer/s3')
const upload = multer({ 
storage: multerS3({ 
  s3: s3,
  // 버킷 이름 
  bucket: 'artvb', 
  acl: 'public-read-write', 
  key: function(req, file, cb) {
  //파일 이름 설정
  cb(null, 
    Math.floor(Math.random() * 1000).toString()
    + Date.now() + '.' + 
    file.originalname.split('.').pop()); 
    } 
  }),
   //사이즈 제한
  limits: { fileSize: 1000 * 1000 * 10 }  }); 
module.exports = upload;

