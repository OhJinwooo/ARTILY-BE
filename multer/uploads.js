const multer = require('multer');
/* const path = require('path') */
const fs =require('fs');

try {
    fs.readdirSync('uploads'); // 폴더 확인
    } catch(err) {
    console.error('uploads 폴더가 없습니다. 폴더를 생성합니다.');
    fs.mkdirSync('uploads'); // 폴더 생성
    }
    
    const storage = multer.diskStorage({
      destination:  (req, file, cb) => {
        cb(null, 'uploads/')
      },
      filename:  (req, file, cb) => {
        cb(null,file.originalname.split(' ').join('_'))// 파일 원본이름 저장
      }
    });

    const upload = multer({ storage: storage });

    module.exports = upload