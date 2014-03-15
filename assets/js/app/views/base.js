App.Views.Base = Backbone.View.extend({
  remove: function() {
    this.$el.html('');
    this.stopListening();
    return this;
  }
});