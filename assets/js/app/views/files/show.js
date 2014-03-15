App.Views.FilesShow = App.Views.Base.extend({
  el: '#viewport',
  template: 'files/show',

  render: function(file) {
    this.file = file;
    var template = Handlebars.templates[this.template];
    var data = file.toJSON();
    data.content = file.getContent();

    this.$el.html(template(data));
  }
});