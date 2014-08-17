Github.Trees = Backbone.Collection.extend({
  url: function() {
    return this.repo.get('trees_url').replace('{/sha}', '/' + this.branch) + '?recursive=99';
  },

  initialize: function(models, repo) {
    this.repo = repo;
    this.branch = this.repo.get('default_branch');
  },

  getBranch: function(branch, callback) {
    this.branch = branch;
    this.fetch({
      success: function(trees, response) {
        trees.reset(response.tree);
        callback(trees);
      }
    });
  },

  getFilesystem: function() {
    var paths = this.pluck('path');
    var filesystem = {
      children: {}
    };

    this.forEach(function(item) {
      var comps = item.get('path').split('/');
      var ref = filesystem;

      for (var c = 0; c < comps.length; c++) {
        ref.children = ref.children || {};
        ref.children[comps[c]] = ref.children[comps[c]] || {
          path: ''
        };

        ref.children[comps[c]].path = comps.slice(0, c + 1).join('/');

        ref = ref.children[comps[c]];
      }
    });

    return filesystem;
  },

  parse: function(tree) {
    return this.reset(tree.tree);
  }
});