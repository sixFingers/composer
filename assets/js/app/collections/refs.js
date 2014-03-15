Github.Refs = Backbone.Collection.extend({
  url: function() {
    return this.repo.get('url') + '/git/refs' + this.branch;
  },

  initialize: function(models, repo) {
    this.repo = repo;
    this.branch = '/heads';
  },

  getHeads: function() {
    this.branch = '/heads';
    Backbone.Collection.prototype.fetch.apply(this, arguments);
  },

  create: function() {
    this.branch = '';
    Backbone.Collection.prototype.create.apply(this, arguments);
  }
});