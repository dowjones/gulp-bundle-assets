var through = require('through2'),
  path = require('path'),
  Bundle = require('./../model/bundle');

module.exports = function(key, type, resultOptions, env, bundleAllEnvironments, bundleOrder, srcFiles) {
  return through.obj(function (file, enc, cb) {
    if (path.extname(file.path) !== '.map') { // ignore .map files
      resultOptions = resultOptions || {};
      resultOptions.bundleOrder = bundleOrder;
      file.bundle = new Bundle({
        name: key,
        type: type,
        result: resultOptions,
        env: env,
        bundleAllEnvironments: bundleAllEnvironments,
        srcFiles: srcFiles
      });
    }
    this.push(file);
    cb();
  });
};
