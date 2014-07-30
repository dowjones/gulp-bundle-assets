var path = require('path'),
  assign = require('lodash').assign;

module.exports = Config;

function Config(filePathOrObject, options) {

  var userConfig;

  if (typeof filePathOrObject === 'string') {
    // todo eval contents instead since we already have it in vinyl-fs buffer
    userConfig = require(path.join(filePathOrObject));
  } else {
    userConfig = filePathOrObject;
  }

  if (!userConfig || !(userConfig.bundle || userConfig.copy)) {
    throw new Error('Configuration file should be in the form "{ bundle: {}, copy: {} }"');
  }
  this.base = (options && options.base) ? options.base : '.';
  assign(this, userConfig);
}

Config.prototype.getAllEnvironments = function () {
  //todo
};