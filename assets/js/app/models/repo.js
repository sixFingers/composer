Github.Repo = Backbone.Model.extend({
  idAttribute: 'full_name',

  urlRoot: function() {
    return Github.apiUri + 'repos';
  },

  initialize: function() {
    this.set('files', new Github.Files([], this));
    this.set('trees', new Github.Trees([], this));
    this.set('refs', new Github.Refs([], this));
    this.set('enabled', this.isEnabled());
  },

  isEnabled: function() {
    return this.get('default_branch') == App.config.branchName;
  },

  save: function(attributes, options) {
    if (!this.isNew()) {
      options = _(options).extend({
        patch: true
      });
      this.url = decodeURIComponent(this.get('url'));
      attributes.name = this.get('name');
    } else {
      this.url = decodeURIComponent(this.collection.url());
    }

    return Backbone.Model.prototype.save.apply(this, [attributes, options]);
  },

  fetch: function() {
    this.url = decodeURIComponent(this.url());
    return Backbone.Model.prototype.fetch.apply(this, arguments);
  },

  destroy: function() {
    this.url = decodeURIComponent(this.get('url'));
    return Backbone.Model.prototype.destroy.apply(this, arguments);
  },

  getStatus: function() {
    var status = {};

    status.configured = this.checkFileSystem();

    return status;
  },

  checkFileSystem: function() {
    var jekyllPaths = [
      '_config.yml',
      '_layouts/default.html',
      '_layouts/post.html',
      '_posts/.README',
      'css/main.css',
      'css/syntax.css',
      'index.html'
    ];

    var paths = this.get('trees').pluck('path');
    var missingPaths = _.difference(jekyllPaths, paths);
    return missingPaths.length > 0 ? missingPaths : true;
  },

  getPosts: function() {
    var posts = this.get('trees').filter(function(blob) {
      return blob.get('path').search(/^\/_posts\/\w.+?$/) >= 0
    });

    return posts;
  },

  getPages: function() {
    var pages = this.get('trees').filter(function(blob) {
      var path = blob.get('path');

      return path.match(/.html/) && !path.match(/_layouts/) && !path.match(/_posts/);
    });

    return pages;
  },

  getLayouts: function() {
    var layouts = this.get('trees').filter(function(blob) {
      var path = blob.get('path');

      return path.match(/_layouts\//);
    });

    return layouts;
  },

  toJSON: function() {
    var json = Backbone.Model.prototype.toJSON.apply(this, arguments);
    json = _(json).omit('trees', 'refs', 'files');
    return json;
  }
});