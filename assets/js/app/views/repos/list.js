App.Views.ReposList = App.Views.Base.extend({
  el: '#full-width',
  template: 'repos/list',

  events: {
    'click button.close': 'removeRepo',
    'keyup input': 'search'
  },

  render: function(repos) {
    var template = Handlebars.templates[this.template];
    this.$el.html(template({
      repos: repos.toJSON()
    }));

    repos.bind('remove', this.onRepoRemoved, this);

    this.repos = repos;
    this.$items = this.$el.find('li');
    this.$title = this.$el.find('.panel-title');
  },

  newRepo: function(e) {
    App.router.newRepo();
  },

  removeRepo: function(e) {
    var id = $(e.target).parent().data('id');
    App.router.removeRepo(id);
  },

  onRepoRemoved: function(repo) {
    this.$el.find('[data-id="' + repo.get('id') + '"]').remove();
  },

  search: function(e) {
    var query = $(e.target).val();
    var _this = this;

    if (query != '') {
      this.$items.hide();

      var results = this.repos.filter(function(repo) {
        return repo.get('name').search(query) >= 0 || repo.get('description').search(query) >= 0;
      });

      _(results).each(function(repo) {
        _this.$el.find('li[data-id="' + repo.get('id') + '"]').show();
      });

      this.$title.text(results.length + ' repos found');
    } else {
      this.$items.show();
      this.$title.text(this.$items.length + ' repos');
    }
  }
});