const env = process.env.NODE_ENV || 'local';
const { OAuth2Client } = require('google-auth-library');
let googleAccountOauthClient;
if (env !== 'ci') {
if (!process.env.SECRETS) {
throw Error('`SECRETS` 환경변수가 설정되어 있지 않습니다');
}
googleAccountOauthClient = JSON.parse(process.env.SECRETS).oauth.google;
if (!googleAccountOauthClient.clientId) {
throw Error('`SECRETS`에 `clientId`가 없습니다.');
}
}
/**
* @param {string} token
* @returns {Promise<TokenPayload|undefined|true>}
* @throws Error
*/
const verifyGoogle = (() => {
if (env === 'ci') return async () => true;
const client = new OAuth2Client(googleAccountOauthClient.clientId);
return async (token) => {
const ticket = await client.verifyIdToken({
idToken: token,
audience: googleAccountOauthClient.clientId,
});
return ticket.getPayload();
};
})();
module.exports = {
verifyGoogle,
};
