App.Views.ReposNew = App.Views.Base.extend({
  el: '#full-width',
  template: 'repos/new',

  events: {
    'submit form': 'submit'
  },

  initialize: function(repos) {
    this.repos = repos;
  },

  render: function() {
    var template = Handlebars.templates[this.template];
    this.$el.html(template());

    this.progress = this.$el.find('.progress');
  },

  submit: function(e) {
    e.preventDefault();

    var repo = $.parseParams($(e.target).serialize());
    repo.auto_init = true;
    var _this = this;
    this.progress.show();

    this.repos.create(repo, {
      success: function(repo) {
        _this.setProgress.call(_this, '25%');
        _this.createBranch.call(_this, repo);
      }
    });
  },

  createBranch: function(repo) {
    var _this = this;
    repo.get('refs').getHeads({
      success: function(head) {
        _this.setProgress.call(_this, '50%');
        repo.get('refs').create({
          ref: 'refs/heads/gh-pages',
          sha: head.at(0).get('object').sha
        }, {
          success: function() {
            _this.setProgress.call(_this, '75%');
            repo.save({
              default_branch: 'gh-pages'
            }, {
              success: function() {
                _this.setProgress.call(_this, '100%');
                App.router.navigate('/repos/' + repo.get('full_name'), {
                  trigger: true
                });
              }
            });
          }
        });
      }
    });
  },

  setProgress: function(width) {
    var messages = {
      '25%': 'Creating repository',
      '50%': 'Querying repository',
      '75%': 'Configuring repository',
      '100%': 'Finalizing repository'
    }
    $progressBar = this.$el.find('.progress-bar')
    $progressBar.width(width);
    $progressBar.text(messages[width]);
  }
});