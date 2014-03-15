App.Views.ReposShow = App.Views.Base.extend({
  el: '#viewport',
  template: 'repos/show',

  render: function(repo) {
    this.repo = repo;
    var template = Handlebars.templates[this.template];
    this.$el.html(template(repo.toJSON()));
  }
});