App.Views.FilesNew = App.Views.Base.extend({
  el: '#viewport',
  template: 'files/new',
  events: {
    'submit form#newFile': 'submitNewFile'
  },

  render: function(repo, type) {
    /**
    
      TODO:
      - Find elegant way to avoid filename duplication (using microtime seems a nice idea to me)
    
    **/
    

    this.repo = repo;
    var template = Handlebars.templates[this.template];
    var data = {}
    if(type === 'posts') {
      data.content = '---\nlayout: default\n---';
      data.path = '_posts/'+(new Date().toISOString().slice(0, 10))+'-new-post-title.md';
      data.message = 'New post';
    }

    this.$el.html(template(data));
    this.cm = this.generateCodeTextArea(this.file, this.$el.find('textarea.codemirror')[0], 'md');
  },

  /**
  
    TODO:
    - Find better way to generate codemirror viewport (as Backbone view helper maybe?)
    
  **/
  

  generateCodeTextArea: function(file, textarea, mode) {
    return CodeMirror.fromTextArea(textarea, {
      theme: 'ambiance', 
      lineNumbers: true, 
      mode: mode || file.getMode(App.config.modes, file.getExtension())
    });
  },

  submitNewFile: function(e) {
    e.preventDefault();
    var params = $.parseParams($(e.currentTarget).serialize());
    var data = {
      path: params.path,
      content: this.cm.getValue(),
      message: params.message
    };

    /**
    
      TODO:
      - Handle possible exceptions
    
    **/
    
    this.repo.get('files').create(data, {
      success: function() {
        console.log('File creation succeeded!');
      }
    });
  }

});