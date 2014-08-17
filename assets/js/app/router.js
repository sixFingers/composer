App.Router = Backbone.Router.extend({
  routes: {
    '': 'home',
    'repos': 'listRepos',
    'repos/new': 'newRepo',
    'repos/:owner/:repo': 'showRepo',
    'repos/:owner/:repo/:type/new': 'newFile',
    'error': 'error'
  },

  signals: {
    'open:file': 'openFile',
    'new:file': 'newFile'
  },

  initialize: function() {
    $.ajaxSetup({ cache: false });
    App.user = new Github.Me();
    App.repos = new Github.Repos();

    // App.userBox = new App.Views.UserBox(App.user);
    App.navigation = new App.Views.Navigation();
    App.reposList = new App.Views.ReposList(App.repos);
    App.reposNew = new App.Views.ReposNew(App.repos);
    App.reposSetup = new App.Views.ReposSetup();
    App.reposShow = new App.Views.ReposShow();
    App.reposRemove = new App.Views.ReposRemove();
    App.reposFilesystem = new App.Views.Filesystem();
    App.filesShow = new App.Views.FilesShow();
    App.filesNew = new App.Views.FilesNew();
    App.error = new App.Views.Error();

    this.$el = $('body');
    App.navigation.render();

    this.on('route', function(route) {
      App.trigger('route', route);
    });

    for (var key in this.signals) {
      App.on(key, this[this.signals[key]], this);
    }

    App.error.render();
  },

  cleanup: function(onlyViewport) {
    var views = [
      App.error,
      App.reposList,
      App.reposNew,
      App.reposSetup,
      App.reposShow,
      App.reposRemove,
      App.reposFilesystem
    ];
    var dead;

    if (onlyViewport) {
      dead = _(views).where({
        el: '#viewport'
      });
    } else {
      dead = views;
    }

    _(dead).each(function(view) {
      view.remove();
    });
  },

  home: function() {
    this.navigate('/repos', {
      trigger: true
    });
  },

  listRepos: function() {
    this.cleanup();

    App.repos.fetch({
      success: function(repos) {
        App.reposList.render(repos);
      }
    });
  },

  showRepo: function(owner, name) {
    this.cleanup();

    var full_name = owner + '/' + name;
    var repo = App.repos.findWhere({
      full_name: full_name
    });

    if (repo) {
      show(repo);
    } else {
      repo = new Github.Repo({
        full_name: full_name
      });

      repo.fetch({
        success: function(repo) {
          App.repos.add(repo);
          show(repo);
        }
      });
    }

    function show(repo) {
      repo.get('trees').getBranch('gh-pages', function(contents) {
        var status = repo.getStatus();
        if (status.configured === true) {
          App.reposFilesystem.render(repo);
          App.reposShow.render(repo);
        } else {
          App.reposSetup.render(repo);
        }
      });
    }
  },

  newRepo: function() {
    this.cleanup();
    App.reposNew.render();
  },

  removeRepo: function(id) {
    var repo = App.repos.findWhere({
      id: id
    });
    App.reposRemove.render(repo);
  },

  openFile: function(repo, path, sha) {
    this.cleanup(true);

    var file = repo.get('files').findWhere({
      sha: sha
    });

    if (!file) {
      data = {
        path: path,
        sha: sha
      };
      file = repo.get('files').add(data);
    };

    file.fetch({
      success: function() {
        App.filesShow.render(file);
      }
    });
  },

  newFile: function(owner, repo, type) {
    var repo = App.repos.findWhere({name: repo});
    App.filesNew.render(repo, type);
  },

  error: function() {
    App.error.render();
  }
});