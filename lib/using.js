var gusing = require('gulp-using');

module.exports = function (key, type, env, bundleAllEnvironments) {
  var envPrefix = '';
  if (bundleAllEnvironments) {
    envPrefix = env ? env + '.' : 'default.';
  }
  var bundleName = envPrefix + key + '.' + type;
  var prefix = type ? 'Bundle "' + bundleName + '" using' : 'Copy file';
  return gusing({
    prefix: prefix
  });
};