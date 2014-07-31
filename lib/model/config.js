var path = require('path'),
  assign = require('lodash').assign,
  vinylRequire = require('vinyl-require');

module.exports = Config;

function Config(file, options) {

  var userConfig;

  if (isInstanceOfVinylFile(file)) {
    userConfig = vinylRequire(file);
  } else {
    userConfig = file;
  }

  if (!userConfig || !(userConfig.bundle || userConfig.copy)) {
    throw new Error('Configuration file should be in the form "{ bundle: {}, copy: {} }"');
  }
  this.base = (options && options.base) ? options.base : '.';
  assign(this, userConfig);
}

// dumb way to do instanceof so this module works when required from other modules
// since `file` will be an instance of an object from a somewhere else
function isInstanceOfVinylFile(file) {
  return file && file.isBuffer && file.pipe;
}

Config.prototype.getAllEnvironments = function () {
  //todo
};