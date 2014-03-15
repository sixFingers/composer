App.Views.Navigation = App.Views.Base.extend({
  el: '#navigation',
  template: 'shared/navigation',

  render: function() {
    var template = Handlebars.templates[this.template];
    this.$el.html(template());

    App.on('route', this.onRoute, this);
  },

  onRoute: function(route) {
    console.log(route)
    var a;

    switch (route) {
      case 'home':
      case 'listRepos':
      case 'newRepo':
        a = 'a[href="/repos"]';
        break;
    };

    this.$el.find('li.active').removeClass('active');
    this.$el.find(a).parent().addClass('active');
  }
});