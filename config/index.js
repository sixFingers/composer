module.exports = {
  sessionSecret: 'session secret',
  github: {
    apiUri: 'https://api.github.com/',
    authorizeUri: 'https://github.com/login/oauth/authorize',
    clientId: '0ab1c2becee1753fbe60',
    clientSecret: '5271e3f60e6ffb0624ae1b9d8db1234aa146a569',
    redirectUri: 'http://localhost:3000/auth',
    scope: 'user,repo,admin:repo_hook,delete_repo',
    accessTokenUri: 'https://github.com/login/oauth/access_token'
  }
}