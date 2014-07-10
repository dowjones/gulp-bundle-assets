var CombineStream = require('combine-stream'),
  fs = require('fs'),
  path = require('path'),
  through = require('through2'),
  File = require('vinyl'),
  Bundle = require('./lib/Bundle'),
  BundleType = require('./lib/BundleType'),
  addBundleResults = require('./lib/bundleResults'),
  gulp = require('gulp'),
  concat = require('gulp-concat'),
  gusing = require('gulp-using'),
  gutil = require('gulp-util'),
  sourcemaps = require('gulp-sourcemaps'),
  uglify = require('gulp-uglify'),
  minifyCSS = require('gulp-minify-css');

function using(key, type) {
  var bundleName = key + '.' + type;
  var prefix = type ? 'Bundle "' + bundleName + '" using' : 'Copy file';
  return gusing({
    prefix: prefix
  });
}

function applyResults(key, type) {
  return through.obj(function (file, enc, cb) {
    file.bundle = new Bundle({
      name: key,
      type: type
    });
    this.push(file);
    cb();
  });
}

function _bundle(config) {
  var streams = [];

  for (var key in config.bundle) {
    if (config.bundle.hasOwnProperty(key)) {

      var bundle = config.bundle[key];

      if (bundle[BundleType.JS]) {
        streams.push(gulp.src(bundle[BundleType.JS], {base: '.'})
          .pipe(using(key, 'js'))
          .pipe(sourcemaps.init())
          .pipe(concat(key + '-bundle.js'))
          .pipe(uglify()) // todo don't do this on already .min files
          .pipe(sourcemaps.write())
          .pipe(gulp.dest(config.dest))
          .pipe(applyResults(key, BundleType.JS)));
      }

      if (bundle[BundleType.CSS]) {
        streams.push(gulp.src(bundle[BundleType.CSS], {base: '.'})
          .pipe(using(key, 'css'))
          .pipe(sourcemaps.init())
          .pipe(concat(key + '-bundle.css'))
          //.pipe(minifyCSS()) // todo fix for source maps
          .pipe(sourcemaps.write())
          .pipe(gulp.dest(config.dest))
          .pipe(applyResults(key, BundleType.CSS)));
      }

      if (bundle.resources) {
        streams.push(gulp.src(bundle.resources, {base: '.'})
          .pipe(using(key))
          .pipe(gulp.dest(config.dest)));
      }

    }
  }

  return new CombineStream(streams);
}

function startBundle(file, enc, cb) {
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

  _bundle(config)
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
}

module.exports = function () {
  return through.obj(startBundle);
};