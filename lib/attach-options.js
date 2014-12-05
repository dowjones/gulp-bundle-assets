var through = require('through2');

module.exports = function (options) {
  return through.obj(function (file, enc, cb) {
    file.bundleAssets = options;
    this.push(file);
    cb();
  });
};