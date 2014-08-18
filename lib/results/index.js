var through = require('through2'),
  gutil = require('gulp-util'),
  path = require('path'),
  bluebird = require('bluebird'),
  writeFile = bluebird.promisify(require('graceful-fs').writeFile),
  mkdirp = require('mkdirp'),
  _ = require('lodash'),
  addBundleResults = require('./add-to-results');

module.exports = function (opts) {

  var resultJsons = {},
    options = {
      dest: './',
      pathPrefix: ''
    };

  if (typeof opts === 'string') {
    options.dest = opts;
  } else {
    _.assign(options, opts);
  }

  function collectResults(file, enc, cb) {
    addBundleResults(resultJsons, file, options.pathPrefix);
    this.push(file);
    cb();
  }

  function writeResults(done) {
    mkdirp(options.dest, function (err) {
      if (err) throw err;

      var streams = [];

      _.each(resultJsons, function (result) {
        var filePath = path.join(options.dest, result.filename),
          data = JSON.stringify(result.contents, null, 2);
        streams.push(writeFile(filePath, data));
      });

      bluebird.all(streams).then(function () {
        done();
      });

    });
  }

  return through.obj(collectResults, writeResults);
};