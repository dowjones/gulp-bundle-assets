var through = require('through2'),
  gutil = require('gulp-util'),
  File = require('vinyl'),
  readableStream = require('readable-stream'),
  duplexer = require('duplexer2'),
  mergeStream = require('merge-stream'),

  streamBundles = require('./lib/stream-bundles'),
  results = require('./lib/results');
  addBundleResults = require('./lib/add-bundle-results');

var gulpBundleAssets = function (options) {
  options = options || {};

  var writable = new readableStream.Writable({objectMode: true});
  var readable = through.obj(function (file, enc, cb) { // noop
    this.push(file);
    cb();
  });

  writable._write = function _write(file, encoding, done) {

    var config;

    if (file.isNull()) {
      this.push(file);
      return cb();
    }

    if (file.isStream()) {
      this.emit('error', new gutil.PluginError('gulp-bundle-assets', 'Streaming not supported'));
      return cb();
    }

    try {
      config = require(file.path); // todo eval contents instead since we already have it in buffer
    } catch (e) {
      gutil.log(gutil.colors.red('Failed to parse config file'));
      this.emit('error', new gutil.PluginError('gulp-bundle-assets', e));
      return cb();
    }

    if (!config || !config.bundle) {
      this.emit('error', new gutil.PluginError('gulp-bundle-assets',
        'Valid bundle configuration file required in the form { bundle: {} }'));
      return cb();
    }

    config.base = options.base || '.';

    mergeStream.apply(mergeStream, streamBundles(config))
      .pipe(readable);
    return done();
  };

  return duplexer(writable, readable);


    /*bundleAssets.call(self, config)
      .on('data', function(file) {
        addBundleResults(output, file);
      })
      .on('error', function (err) {
        self.emit('error', new gutil.PluginError('gulp-bundle-assets', err));
        return cb();
      })
      .on('end', function () {
        var result = new File({
          path: "bundle.result.json",
          contents: new Buffer(JSON.stringify(output, null, 2))
        });
        self.push(result);
        cb();
      });*/

};

gulpBundleAssets.results = results;

module.exports = gulpBundleAssets;