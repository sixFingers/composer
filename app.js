var express = require('express');
var path = require('path');
var fs = require('fs');
var url = require('url');
var assets = require('connect-assets');
var handlebars = require('connect-handlebars')
var flash = require('express-flash');
var request = require('request');

var config = require('./config');
var applicationController = require('./controllers/application');

// Configuration
var hour = 3600000;
var day = (hour * 24);
var week = (day * 7);
var month = (day * 30);

var app = express();
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Middleware
app.use(assets({
  helperContext: app.locals
}));
app.use("/js/templates.js", handlebars(__dirname + "/assets/js/app/templates", {
  exts: ['hbs', 'handlebars']
}));
app.use(express.compress());
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.cookieSession({
  secret: config.sessionSecret
}));
app.use(express.csrf());
app.use(flash());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: week
}));
app.use(function(req, res) {
  res.status(404);
  res.render('404');
});
app.use(express.errorHandler());

var authenticated = function(req, res, next) {
  if (!req.session.access_token) return res.redirect('/auth');
  res.locals.access_token = req.session.access_token;
  res.locals.api_uri = config.github.apiUri;
  next();
};

var authenticate = function(req, res, next) {
  if (req.query.code) {
    request({
      url: 'https://github.com/login/oauth/access_token',
      method: 'post',
      form: {
        client_id: config.github.clientId,
        client_secret: config.github.clientSecret,
        code: req.query.code,
        redirect_uri: config.github.redirectUri
      },
      headers: {
        'Accept': 'application/json'
      }
    }, function(error, response, body) {
      if (!error && response.statusCode == 200) {
        body = JSON.parse(body);
        req.session.access_token = body.access_token;
        res.redirect('/');
      } else {
        next(error);
      }
    });
  } else {
    next();
  }
};

// Routes
app.get('/', authenticated, applicationController.index);
app.get('/auth', authenticate, applicationController.auth);
app.get('/logout', applicationController.logout);
app.get(/^\/jekyll\/(\w.+)?$/, function(req, res, next) {
  var uri = url.parse(req.url).pathname;
  uri = decodeURIComponent(uri);
  var filename = path.join(__dirname, 'public', uri);
  fs.exists(filename, function(exists) {
    fs.readFile(filename, function(e, file) {
      res.setHeader('Content-Type:', 'text/plain');
      res.writeHead(200);
      res.write(file);
      res.end();
    });
  });
});

// Startup
app.listen(app.get('port'), function() {
  console.log("✔ Express server listening on port %d in %s mode", app.get('port'), app.settings.env);
});