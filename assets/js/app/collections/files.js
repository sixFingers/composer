Github.Files = Backbone.Collection.extend({
  model: Github.File,

  url: function() {
    return this.repo.get('url') + '/contents';
  },

  initialize: function(models, repo) {
    this.repo = repo;
  },

  create: function(attributes) {
    attributes.content = Base64.encode(attributes.content);

    var file = new Github.File(attributes, {
      collection: this
    });

    Backbone.Model.prototype.save.apply(file, arguments);
  }
});