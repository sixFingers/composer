App.Views.Error = App.Views.Base.extend({
  el: '#full-width',
  template: 'shared/error',

  render: function() {
    var template = Handlebars.templates[this.template];
    this.$el.html(template());

  }
});