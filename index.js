var CombineStream = require('combine-stream'),
  fs = require('fs'),
  path = require('path'),
  through = require('through2'),
  File = require('vinyl'),
  bundleToHtml = require('./lib/bundleToHtml'),
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
    file.bundle = {
      name: key,
      type: type
    };
    this.push(file);
    cb();
  });
}

function _bundle(config) {
  var streams = [];

  for (var key in config.bundle) {
    if (config.bundle.hasOwnProperty(key)) {

      var bundle = config.bundle[key];

      if (bundle.scripts) {
        streams.push(gulp.src(bundle.scripts, {base: '.'})
          .pipe(using(key, 'js'))
          .pipe(sourcemaps.init())
          .pipe(concat(key + '-bundle.js'))
          .pipe(uglify()) // todo don't do this on already .min files
          .pipe(sourcemaps.write())
          .pipe(gulp.dest(config.dest))
          .pipe(applyResults(key, 'scripts')));
      }

      if (bundle.styles) {
        streams.push(gulp.src(bundle.styles, {base: '.'})
          .pipe(using(key, 'css'))
          .pipe(sourcemaps.init())
          .pipe(concat(key + '-bundle.css'))
          //.pipe(minifyCSS()) // todo fix for source maps
          .pipe(sourcemaps.write())
          .pipe(gulp.dest(config.dest))
          .pipe(applyResults(key, 'styles')));
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
    bundleResults = {};

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
    .on('data', function (file) {
      if (file.bundle) {
        bundleResults[file.bundle.name] = bundleResults[file.bundle.name] || {};
        bundleResults[file.bundle.name][file.bundle.type] =
          bundleToHtml[file.bundle.type](file.path.replace(file.base, ''));
      }
    })
    .on('error', function (err) {
      self.emit('error', new gutil.PluginError('gulp-bundle-assets', err));
      return cb();
    })
    .on('end', function () {
      var result = new File({
        path: "bundle.result.json",
        contents: new Buffer(JSON.stringify(bundleResults, null, 2))
      });
      self.push(result);
      cb();
    });
}

module.exports = function () {
  return through.obj(startBundle);
};