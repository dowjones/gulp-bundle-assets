var colors = require('ansi-colors'),
  logger = require('./service/logger'),
  through = require('through2'),
  stringHelper = require('./string-helper');

module.exports.bundleName = function(key, type) {
  return key + '.' + type;
};

module.exports.bundle = function (key, type) {
  var bundleName = this.bundleName(key, type);
  var prefix = "Bundle '" + colors.green(bundleName) + "' using";
  return through.obj(function (file, enc, cb) {
    logger.log(prefix, colors.magenta(file.relative));
    this.push(file);
    cb();
  });
};

module.exports.copy = function (base) {
  return through.obj(function (file, enc, cb) {
    var pathReplace = (base === '.') ? file.cwd : base;
    if (!stringHelper.endsWith(pathReplace, '/')) {
      pathReplace += '/';
    }
    logger.log("Copy file", colors.magenta(file.path.replace(pathReplace, '')));
    this.push(file);
    cb();
  });
};