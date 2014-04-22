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
    var _this = this;
    this.repo.get('files').create(data, {
      success: function() {
        // Redirect to repo root
        _this.repo.get('trees').fetch({
          remove:true,
          success: function() {
            App.router.navigate('repos/'+_this.repo.get('full_name'), {trigger:true});
          }
        });
      }
    });
  }

});