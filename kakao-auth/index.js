const passport = require("passport");
const KakaoStrategy = require("passport-kakao").Strategy;
const User = require("../schemas/user.schemas");
require("dotenv").config();

module.exports = () => {
  passport.use(
    new KakaoStrategy(
      {
        clientID: process.env.clientID, // 카카오 로그인에서 발급받은 REST API 키
        callbackURL: "http://localhost:3000/oauth/kakao/callback", // 카카오 로그인 Redirect URI 경로
      },
      // clientID에 카카오 앱 아이디 추가
      // callbackURL: 카카오 로그인 후 카카오가 결과를 전송해줄 URL
      // accessToken, refreshToken : 로그인 성공 후 카카오가 보내준 토큰
      // profile: 카카오가 보내준 유저 정보. profile의 정보를 바탕으로 회원가입

      async (accessToken, refreshToken, profile, done) => {
        try {
          console.log(profile);
          console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
          const exUser = await User.findOne({
            // 카카오 플랫폼에서 로그인 했고 & snsId필드에 카카오 아이디가 일치할경우
            userId: profile.id,
            provider: "kakao",
          });

          // console.log("newUser", exUser);
          // 이미 가입된 카카오 프로필이면 성공
          let profileUrl = "";
          if (exUser) {
            console.log(99999999999, exUser);
            done(null, exUser); // 로그인 인증 완료
          } else {
            if (profile._json.properties?.profile_image) {
              profileUrl = profile._json.properties?.profile_image;
            }

            const user = {
              refreshToken: refreshToken,
              nickname: profile.username,
              userId: profile.id,
              provider: "kakao",
              profileUrl,
            };

            // 가입되지 않는 유저면 회원가입 시키고 로그인을 시킨다
            await User.create(user);

            console.log(822222888, user);
            done(null, user); // 회원가입하고 로그인 인증 완료
          }
        } catch (error) {
          console.error(error);
          done(error);
        }
      }
    )
  );
};

// profile{
//   id: 2221693614,
//   provider: 'kakao',
//   username: '김영경',
//   displayName: '김영경',

// _raw: '{"id":2221693614, "connected_at":"2022-04-29T06:05:32Z","properties":{"nickname":"김영경"},
// "kakao_account":{"profile_nickname_needs_agreement":false, "profile_image_needs_agreement":false,
// "profile":{"nickname":"김영경", "thumbnail_image_url":"http://k.kakaocdn.net/dn/bX6fsi/btrAOAZ88w3/wLjKgaZEm4V6oKaQKyJqF1/img_110x110.jpg",
// "profile_image_url":"http://k.kakaocdn.net/dn/bX6fsi/btrAOAZ88w3/wLjKgaZEm4V6oKaQKyJqF1/img_640x640.jpg",

// "is_default_image":false}}}',

//   _json: {
//    id: 2221693614,
//     connected_at: '2022-04-29T06:05:32Z',
//     properties: { nickname: '김영경' },
//     kakao_account: {
//       profile_nickname_needs_agreement: false,
//       profile_image_needs_agreement: false,
//       profile: [Object]
//     }
//   }

// {
//     provider: 'kakao',
//   id: 2222423044,
//   username: '이한울',
//   displayName: '이한울',
//   _raw: '{"id":2222423044,"connected_at":"2022-04-29T17:20:56Z","properties":{"nickname":"이한울"},"kakao_account":{"profile_nickname_needs_agreement":false,"profile_image_needs_agreement":true,"profile":{"nickname":"이한울"}}}',
//   _json: {
//       id: 2222423044,
//       connected_at: '2022-04-29T17:20:56Z',
//     properties: { nickname: '이한울' },
//     kakao_account: {
//         profile_nickname_needs_agreement: false,
//         profile_image_needs_agreement: true,
//         profile: [Object]
//     }
//   }
// }

// {
//   provider: 'kakao',
//   id: 2221693614,
//   username: '김영경',
//   displayName: '김영경',
//   _raw: '{"id":2221693614,"connected_at":"2022-04-29T06:05:32Z","properties":{"nickname":"김영경"},"kakao_account":{"profile_nickname_needs_agreement":false,"profile_image_needs_agreement":false,"profile":{"nickname":"김영경","thumbnail_image_url":"http://k.kakaocdn.net/dn/bX6fsi/btrAOAZ88w3/wLjKgaZEm4V6oKaQKyJqF1/img_110x110.jpg","profile_image_url":"http://k.kakaocdn.net/dn/bX6fsi/btrAOAZ88w3/wLjKgaZEm4V6oKaQKyJqF1/img_640x640.jpg","is_default_image":false}}}',
//   _json: {
//     id: 2221693614,
//     connected_at: '2022-04-29T06:05:32Z',
//     properties: { nickname: '김영경' },
//     kakao_account: {
//       profile_nickname_needs_agreement: false,
//       profile_image_needs_agreement: false,
//       profile: [Object]
//     }
//   }
// }
// {
// provider: 'kakao',
// id: 2222434554,
// username: '진우',
// displayName: '진우',
// _raw: '{"id":2222434554,"connected_at":"2022-04-29T17:55:38Z","properties":{"nickname":"진우","profile_image":"http://k.kakaocdn.net/dn/bm39xQ/btry32waEu1/tNiMvr9Grqn6cXBvnplfc0/img_640x640.jpg","thumbnail_image":"http://k.kakaocdn.net/dn/bm39xQ/btry32waEu1/tNiMvr9Grqn6cXBvnplfc0/img_110x110.jpg"},"kakao_account":{"profile_nickname_needs_agreement":false,"profile_image_needs_agreement":false,"profile":{"nickname":"진우","thumbnail_image_url":"http://k.kakaocdn.net/dn/bm39xQ/btry32waEu1/tNiMvr9Grqn6cXBvnplfc0/img_110x110.jpg","profile_image_url":"http://k.kakaocdn.net/dn/bm39xQ/btry32waEu1/tNiMvr9Grqn6cXBvnplfc0/img_640x640.jpg","is_default_image":false}}}',
// _json: {
//   id: 2222434554,
//   connected_at: '2022-04-29T17:55:38Z',
//   properties: {
//     nickname: '진우',
//     profile_image: 'http://k.kakaocdn.net/dn/bm39xQ/btry32waEu1/tNiMvr9Grqn6cXBvnplfc0/img_640x640.jpg',
//     thumbnail_image: 'http://k.kakaocdn.net/dn/bm39xQ/btry32waEu1/tNiMvr9Grqn6cXBvnplfc0/img_110x110.jpg'
//   },
//   kakao_account: {
//     profile_nickname_needs_agreement: false,
//     profile_image_needs_agreement: false,
//     profile: [Object]
//   }
// }
