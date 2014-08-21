var chalk = require('chalk'),
  gutil = require('gulp-util'),
  through = require('through2'),
  stringHelper = require('./string-helper');

module.exports.bundle = function (key, type, env, bundleAllEnvironments) {
  var envPrefix = '';
  if (bundleAllEnvironments) {
    envPrefix = env ? env + '.' : 'default.';
  }
  var bundleName = envPrefix + key + '.' + type;
  var prefix = "Bundle '" + chalk.green(bundleName) + "' using";
  return through.obj(function (file, enc, cb) {
    gutil.log(prefix, chalk.magenta(file.relative));
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
    gutil.log("Copy file", chalk.magenta(file.path.replace(pathReplace, '')));
    this.push(file);
    cb();
  });
};