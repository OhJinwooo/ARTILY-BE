const github = {
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  redirectUri: 'http://localhost:3000/auth/github/callback',
};
 
module.exports = {
  get: (req, res) => {
    const githubAuthUrl =
      'https://github.com/login/oauth/authorize?client_id=' +
      github.clientID +
      '&redirect_uri=' +
      github.redirectUri;
 
    res.redirect(githubAuthUrl);
  },
};
