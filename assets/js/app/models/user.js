Github.Me = Backbone.Model.extend({
  urlRoot: function() {
    return Github.apiUri + 'user';
  }
});