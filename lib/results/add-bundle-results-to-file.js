var through = require('through2'),
  Bundle = require('./../model/bundle');

module.exports = function(key, type, env, bundleAllEnvironments) {
  return through.obj(function (file, enc, cb) {
    file.bundle = new Bundle({
      name: key,
      type: type,
      env: env,
      bundleAllEnvironments: bundleAllEnvironments
    });
    this.push(file);
    cb();
  });
};