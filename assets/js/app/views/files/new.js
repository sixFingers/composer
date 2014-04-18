App.Views.FilesNew = App.Views.Base.extend({
  el: '#viewport',
  template: 'files/new',
  events: {
    'submit form#newFile': 'submitNewFile'
  },

  render: function(repo, type) {
    this.repo = repo;
    var template = Handlebars.templates[this.template];
    var data = {}
    if(type === 'posts') {
      data.content = '---\nlayout: default\n---';
      data.path = '_posts/'+(new Date().toISOString().slice(0, 10))+'-new-post-'+(new Date().getTime())+'.md';
      data.message = 'New post';
    }

    this.$el.html(template(data));
    this.cm = this.generateCodeTextArea('md', this.$el.find('textarea.codemirror')[0]);
  },

  /**
  
    TODO:
    - Find better way to generate codemirror viewport (as Backbone view helper maybe?)
    
  **/

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
      var _this = this;
      success: function() {
        _this.repo.get('trees').fetch({
          remove: false
          /**
            TODO:
            - Bind render to fetch event
          **/
        });
        console.log('File creation succeeded!');
      }
    });
  }

});