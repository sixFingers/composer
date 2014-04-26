App.Views.FilesShow = App.Views.Base.extend({
  el: '#viewport',
  template: 'files/show',
  events: {
    'submit form#fileContent': 'submitForm',
    'keyup textarea': 'renderPreview'
  },

  render: function(file) {
    this.file = file;
    var template = Handlebars.templates[this.template];
    var data = file.toJSON();
    data.content = file.getContent();

    this.$el.html(template(data));
    this.cm = this.generateCodeTextArea(this.file.getExtension(), this.$el.find('textarea.codemirror')[0]);
    this.renderPreview();
  },

  submitForm: function(e) {
    e.preventDefault();
    var data = $(e.currentTarget).serializeArray();
    var content = Base64.encode(this.cm.getValue());
    var message = _.findWhere(data, {name:"message"}).value;
    this.file.save({content: content, message: message}, {
      success: function() {
        $('.alert-success').slideDown().delay(3000).fadeOut("slow");
      }
    });
  }

});