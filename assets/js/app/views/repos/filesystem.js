App.Views.Filesystem = App.Views.Base.extend({
  el: '#sidebar',
  template: 'repos/filesystem',

  events: {
    'click li.folder': 'browse',
    'click li.file': 'open',
  },

  render: function(repo) {
    var template = Handlebars.templates[this.template];
    var filesystem = repo.get('trees').getFilesystem();
    var posts = repo.getPosts();
    var pages = repo.getPages();
    var layouts = repo.getLayouts();
    var data = _(repo.toJSON()).extend({
      posts: posts.length,
      pages: pages.length,
      layouts: layouts.length,
      filesystem: filesystem
    });

    this.$el.html(template(data));
    this.$filesystem = this.$el.find('.filesystem');
    this.$filesystem.children('ul').find('ul').hide();
    this.repo = repo;
  },

  browse: function(e) {
    $item = $(e.target);
    $item.toggleClass('open');
    $item.next().toggle();
  },

  open: function(e) {
    $item = $(e.target);
    var path = $item.data('path');
    var sha = this.repo.get('trees').findWhere({
      path: path
    }).get('sha');
    
    App.trigger('open:file', this.repo, path, sha);
  },

  remove: function() {
    this.$el.html('');
    this.stopListening();
    return this;
  }
});