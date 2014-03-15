Github.Repos = Backbone.Collection.extend({
  url: function() {
    return Github.apiUri + 'user/repos';
  },

  model: Github.Repo
});