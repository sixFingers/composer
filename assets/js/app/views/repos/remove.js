App.Views.ReposRemove = App.Views.Base.extend({
  el: '#modal',
  template: 'repos/remove',

  events: {
    'click button.confirm': 'removeRepo',
    'click a': 'openRepo'
  },

  render: function(repo) {
    this.repo = repo;
    var template = Handlebars.templates[this.template];
    this.$el.html(template(repo.toJSON()));
    this.$modal = this.$el.find('#remove-repo-modal');
    this.$modal.modal('show');
    var _this = this;
    this.$modal.on('hidden.bs.modal', function(e) {
      _this.remove();
    });
  },

  removeRepo: function(e) {
    var _this = this;
    this.repo.destroy({
      success: function() {
        _this.$modal.modal('hide');
      }
    });
  }
});