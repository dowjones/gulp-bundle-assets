var path = require('path'),
  _ = require('lodash'),
  deepPluck = require('../deep-pluck'),
  deepPluckParent = require('../deep-pluck-parent'),
  BundleType = require('./bundle-type'),
  PluginError = require('plugin-error');

module.exports = Config;

function Config(file, options) {

  var userConfig;

  if (isInstanceOfVinylFile(file)) {
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

  if (!userConfig || !(userConfig.bundle || userConfig.copy)) {
    throw new PluginError('gulp-bundle-assets', 'Configuration file should be in the form "{ bundle: {}, copy: {} }"');
  }
  this.options = _.merge({
    base: '.'
  }, options);
  _.merge(this, userConfig);

}

// dumb way to do instanceof so this module works when required from other modules
// since `file` will be an instance of an object from a somewhere else
function isInstanceOfVinylFile(file) {
  return file && file.isBuffer && file.pipe;
}

function isString(val) {
  return typeof val === 'string';
}
