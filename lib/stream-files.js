var gulp = require('gulp'),
  through = require('through2'),
  gif = require('gulp-if'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  rev = require('gulp-rev'),
  streamify = require('gulp-streamify'),
  minifyCSS = require('gulp-minify-css'),
  gsourcemaps = require('gulp-sourcemaps'),
  gutil = require('gulp-util'),
  logger = require('./service/logger'),
  using = require('./using'),
  sourcemaps = require('./sourcemaps'),
  isOptionEnabled = require('./is-option-enabled'),
  addBundleResultsToFile = require('./results/add-bundle-results-to-file'),
  BundleKeys = require('./model/bundle-keys'),
  isMinEnabled = require('./is-min-enabled');

module.exports.handleTransformError = function (bundleName, bundleKey, err) {
  logger.log(gutil.colors.red("ERROR in custom transforms for '" + bundleName + "." + bundleKey + "':"));
  logger.log(err);
};

module.exports.scripts = function (opts) {
  var self = this;
  return gulp.src(opts.src, {base: opts.base})
    .pipe(using.bundle(opts.bundleName, BundleKeys.SCRIPTS, opts.env, opts.isBundleAll))
    .pipe(gif(function (file) {
        return sourcemaps.isEnabled(opts);
      }, gsourcemaps.init({loadMaps: true})
    ))
    .pipe(opts.bundleOptions.transforms[BundleKeys.SCRIPTS]())
    .on('error', function (e) {
      self.handleTransformError(opts.bundleName, BundleKeys.SCRIPTS, e);
    })
    .pipe(gif(function (file) {
        return sourcemaps.isEnabled(opts);
      }, through.obj(sourcemaps.verify)
    ))
    .pipe(gif(function (file) {
        return isMinEnabled.js(file, opts);
      },
      gif(function (file) {
          return file.isStream();
        },
        streamify(
          uglify()),
        uglify()
      )))
    .pipe(gif(function (file) {
        return file.isStream();
      },
      streamify(concat(opts.bundleName + ((opts.isBundleAll && opts.env) ? '.' + opts.env : '') + '.js')),
      concat(opts.bundleName + ((opts.isBundleAll && opts.env) ? '.' + opts.env : '') + '.js')
    ))
    .pipe(gif(isOptionEnabled(opts.bundleOptions.rev, opts.env),
      gif(function (file) {
        return file.isStream();
      }, streamify(rev()), rev())
    ))
    .pipe(gif(function (file) {
        return sourcemaps.isEnabled(opts);
      }, gsourcemaps.write('maps')
    ))
    .pipe(addBundleResultsToFile(opts.bundleName, BundleKeys.SCRIPTS, opts.bundleOptions.result, opts.env, opts.isBundleAll));
};

module.exports.styles = function (opts) {
  var self = this;
  return gulp.src(opts.src, {base: opts.base})
    .pipe(using.bundle(opts.bundleName, BundleKeys.STYLES, opts.env, opts.isBundleAll))
    .pipe(
    gif(function (file) {
        return sourcemaps.isEnabled(opts);
      }, gsourcemaps.init({loadMaps: true})
    ))
    .pipe(opts.bundleOptions.transforms[BundleKeys.STYLES]())
    .on('error', function (e) {
      self.handleTransformError(opts.bundleName, BundleKeys.STYLES, e);
    })
    .pipe(gif(function (file) {
        return sourcemaps.isEnabled(opts);
      }, through.obj(sourcemaps.verify)
    ))
    .pipe(gif(function (file) {
      return isMinEnabled.css(file, opts);
    }, minifyCSS()))
    .pipe(concat(opts.bundleName + ((opts.isBundleAll && opts.env) ? '.' + opts.env : '') + '.css'))
    .pipe(gif(isOptionEnabled(opts.bundleOptions.rev, opts.env), rev()))
    .pipe(gif(function (file) {
        return sourcemaps.isEnabled(opts);
      }, gsourcemaps.write('maps')
    ))
    .pipe(addBundleResultsToFile(opts.bundleName, BundleKeys.STYLES, opts.bundleOptions.result, opts.env, opts.isBundleAll));
};