App.Views.UserBox = App.Views.Base.extend({
  el: '#user-box',
  template: 'user/box',

  initialize: function(user) {
    this.user = user;
    var _this = this;
    user.fetch({
      success: function() {
        _this.render.apply(_this);
      }
    });
  },

  render: function() {
    var template = Handlebars.templates[this.template];
    this.$el.html(template(this.user.toJSON()));
  }
});