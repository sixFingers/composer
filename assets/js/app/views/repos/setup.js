App.Views.ReposSetup = App.Views.Base.extend({
  el: '#full-width',
  template: 'repos/setup',
  messageTemplate: 'shared/messages',

  events: {
    'click button#start': 'setupJekyll',
  },

  render: function(repo) {
    this.repo = repo;
    var template = Handlebars.templates[this.template];
    var repo = this.repo.toJSON();
    this.$el.html(template(repo));

    this.$progress = this.$el.find('.progress');
    this.$progressBar = this.$el.find('.progress-bar');
    this.$text = this.$el.find('p');
  },

  setupJekyll: function() {
    var missing = this.repo.checkFileSystem();
    var total = missing.length;
    if (missing === true) return;

    var repo = this.repo;
    this.$progress.show();
    var $progressBar = this.$progressBar;
    var $text = this.$text;

    if (missing.length > 0) {
      write(missing[0]);
    }

    function next(e) {
      if (e) {
        console.log(e);
      }

      missing.shift();
      if (missing.length > 0) {
        write(missing[0]);
      }

      var ratio = ((total - missing.length) / total * 100) + '%';
      var message = missing.length > 0 ? 'Wrote file: ' + missing[0] : 'Done!'
      $progressBar.css('width', ratio);
      $text.text(message);
    }

    function write(path) {
      $.get('jekyll/' + path, function(content) {
        var data = {
          path: path,
          content: content,
          message: 'Jekyll setup: ' + path
        };

        repo.get('files').create(data, {
          success: function() {
            next()
          },
          error: function() {
            next(arguments);
          }
        });
      });
    }
  }
});