var through = require('through2'),
  gutil = require('gulp-util'),
  path = require('path'),
  fs = require('fs'),
  mkdirp = require('mkdirp'),
  addBundleResults = require('./add-bundle-results');

module.exports = function (dest) {

  var resultJson = {};

  function collectResults(file, enc, cb) {
    addBundleResults(resultJson, file);
    this.push(file);
    cb();
  }

  function writeResults(done) {
    mkdirp(dest, function (err) {
      if (err) throw err;

      var resultJsonPath = path.join(dest, 'bundle.result.json');
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