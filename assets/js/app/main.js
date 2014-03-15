$(document).ready(function() {
  Github.accessToken = $('meta[name=access-token]').attr('content');
  Github.apiUri = $('meta[name=api-uri]').attr('content');

  $.ajaxSetup({
    headers: {
      'Authorization': 'token ' + Github.accessToken
    },
    statusCode: {
      404: function() {
        App.router.navigate('/error', {
          trigger: true
        });
      }
    }
  });

  _.extend(App, Backbone.Events);
  App.router = new App.Router();
  Backbone.history.start({
    root: '/'
  });

  $('body').on('click', 'a.pushstate', function(e) {
    e.preventDefault();
    App.router.navigate($(e.target).attr('href'), {
      trigger: true
    });
  });
});