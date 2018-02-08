var logger = require('./service/logger'),
  colors = require('ansi-colors'),
  warnPrefix = colors.bgyellow(colors.black('WARN'));

function StreamBundlesUtil() {
}

StreamBundlesUtil.prototype.warnIfNoBundleProperty = function (config) {
  if (config && !config.bundle && config.file && config.file.relative) { // can guarantee !!file b/c (config instanceof Config)
    logger.log(warnPrefix, "No '" + colors.cyan('bundle') +
      "' property found in " + colors.magenta(config.file.relative) + ". Did you mean to define one?");
  }
};

// naturally a singleton because node's require caches the value assigned to module.exports
module.exports = new StreamBundlesUtil();