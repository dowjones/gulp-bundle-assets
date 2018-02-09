var through = require('through2'),
  path = require('path'),
  Bundle = require('./../model/bundle');

module.exports = function(key, type, resultOptions, bundleOrder, srcFiles) {
  return through.obj(function (file, enc, cb) {
    if (path.extname(file.path) !== '.map') { // ignore .map files
      resultOptions = resultOptions || {};
      resultOptions.bundleOrder = bundleOrder;
      file.bundle = new Bundle({
        name: key,
        type: type,
        result: resultOptions,
        srcFiles: srcFiles
      });
    }
    this.push(file);
    cb();
  });
};
