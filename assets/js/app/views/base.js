App.Views.Base = Backbone.View.extend({
  codeMirrorModes: {
    htmlmixed: ['html', 'xthml'],
    css: ['css'],
    yaml: ['yml'],
    markdown: ['md']
  },

  remove: function() {
    this.$el.html('');
    this.stopListening();
    return this;
  },

  generateCodeTextArea: function(ext, textarea) {
    var mode = 'md';
    _.each(this.codeMirrorModes, function(value, key) { 
      if(_.contains(value, ext)) mode = key; 
    }) 
    return CodeMirror.fromTextArea(textarea, {
      theme: 'ambiance', 
      lineNumbers: true, 
      mode: mode
    });
  }
});
