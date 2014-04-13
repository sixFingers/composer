App.Views.FilesShow = App.Views.Base.extend({
  el: '#viewport',
  template: 'files/show',

  render: function(file) {
    this.file = file;
    var template = Handlebars.templates[this.template];
    var data = file.toJSON();
    data.content = file.getContent();

    this.$el.html(template(data));
    this.generateCodeTextArea(this.file, this.$el.find('textarea.codemirror')[0]);
  },

  generateCodeTextArea: function(file, textarea) {
    return CodeMirror.fromTextArea(textarea, {
      theme: 'ambiance', 
      lineNumbers: true, 
      mode: file.getMode(App.config.modes, file.getExtension())
    });
  }
});