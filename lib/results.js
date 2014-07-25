var through = require('through2'),
  gutil = require('gulp-util'),
  path = require('path'),
  fs = require('fs'),
  mkdirp = require('mkdirp'),
  assign = require('lodash').assign,
  addBundleResults = require('./add-bundle-results');

module.exports = function (opts) {

  var resultJson = {},
    options = {
      dest: './',
      pathPrefix: ''
    };

  if (typeof opts === 'string') {
    options.dest = opts;
  } else {
    assign(options, opts);
  }

  function collectResults(file, enc, cb) {
    addBundleResults(resultJson, file, options.pathPrefix);
    this.push(file);
    cb();
  }

  function writeResults(done) {
    mkdirp(options.dest, function (err) {
      if (err) throw err;

      var resultJsonPath = path.join(options.dest, 'bundle.result.json');
      fs.writeFile(resultJsonPath,
        JSON.stringify(resultJson, null, 2),
        function (err) {
          if (err) throw err;

          gutil.log('Created file', gutil.colors.magenta(resultJsonPath));
          done();
        });

    });
  }

  return through.obj(collectResults, writeResults);
};