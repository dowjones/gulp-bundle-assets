var path = require('path'),
  assign = require('lodash').assign;

module.exports = Config;

function Config(filePath, options) {
  // todo eval contents instead since we already have it in buffer
  var userConfig = require(path.join(filePath));
  if (!userConfig || !(userConfig.bundle || userConfig.copy)) {
    throw new Error('Configuration file should be in the form "{ bundle: {}, copy: {} }"');
  }
  userConfig.base = options.base || '.';
  assign(this, userConfig);
}

Config.prototype.getAllEnvironments = function () {
  //todo
};