var config = require('../config');

exports.index = function(req, res) {
  res.render('application/index', {
    title: 'Welcome'
  });
};

exports.auth = function(req, res) {
  res.render('application/auth', {
    title: 'Authenticate',
    clientId: config.github.clientId,
    redirectUri: config.github.redirectUri,
    authorizeUri: config.github.authorizeUri,
    accessTokenUri: config.github.accessTokenUri,
    scope: config.github.scope
  });
};

exports.logout = function(req, res) {
  delete req.session.access_token;
  res.redirect('/');
};