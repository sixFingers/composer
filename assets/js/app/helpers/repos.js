Handlebars.registerHelper('fileTree', function(filesystem) {
  function wrap(tree) {
    var html = '';
    if (tree.path) {
      var comps = tree.path.split('/');
      var label = comps[comps.length - 1];
      html += '<li data-path="' + tree.path + '" class="' + (tree.children ? 'folder' : 'file') + '">' + label + '</li>';
    };

    if (tree.children) {
      html += '<ul>';
      for (var key in tree.children) {
        html += wrap(tree.children[key]);
      }
      html += '</ul>';
    }
    return html;
  }

  var rendered = wrap(filesystem);
  return new Handlebars.SafeString(rendered);
});