Github.Ref = Backbone.Model.extend({
  urlRoot: function() {
    return Github.apiUri + 'repos/' + this.repo.full_name + '/git/trees/:sha?recursive=1';
  },

  initialize: function(repo) {
    this.repo = repo || this.collection.repo;
  }
});