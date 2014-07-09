module.exports = {
  scripts: function (path) {
    return "<script type='text/javascript' src='" + path + "'></script>";
  },
  styles: function (path) {
    return "<link rel='stylesheet' href='" + path + "' />"
  }
  // todo noop func as default?
};