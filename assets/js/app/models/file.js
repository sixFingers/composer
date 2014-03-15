Github.File = Backbone.Model.extend({
  idAttribute: 'path',

  urlRoot: function() {
    return this.repo.get('url') + '/contents';
  },

  initialize: function() {
    this.repo = this.collection.repo;
  },

  getContent: function() {
    return Base64.decode(this.get('content'));
  },

  getType: function() {
    if (this.get('path').search(/^\/_posts\/\w.+?$/) >= 0) {
      return 'post';
    } else if (path.match(/.html/) && !path.match(/_layouts/) && !path.match(/_posts/)) {
      return 'page';
    } else {
      return 'code';
    }
  }
});