var through = require('through2'),
  gutil = require('gulp-util'),
  File = require('vinyl'),
  bundleAssets = require('./lib/bundle-assets'),
  addBundleResults = require('./lib/bundle-results');

module.exports = function (options) {
  options = options || {};

  return through.obj(function (file, enc, cb) {
    var self = this,
      config,
      output = {};

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
    config.dest = options.dest || './public';

    bundleAssets.call(self, config)
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
      });
  });
};