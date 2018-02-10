var _ = require('lodash'),
  PluginError = require('plugin-error'),
  Vinyl = require('vinyl');

module.exports = Config;

function Config(file, options) {

  var userConfig;

  if (Vinyl.isVinyl(file)) {
    userConfig = require(file.path);
    userConfig.file = {
      cwd: file.cwd,
      base: file.base,
      path: file.path,
      relative: file.relative
    };
  } else {
    userConfig = file;
  }

  if (!userConfig || !userConfig.bundle) {
    throw new PluginError('gulp-bundle-assets', 'Configuration file does not contain a "bundle" key. EG: "{ bundle: {} }"');
  }
  this.options = _.merge({
    base: '.'
  }, options);
  _.merge(this, userConfig);

}
