var gulp = require('gulp'),
  through = require('through2'),
  gif = require('gulp-if'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  rev = require('gulp-rev'),
  streamify = require('gulp-streamify'),
  minifyCSS = require('gulp-minify-css'),
  sourcemaps = require('gulp-sourcemaps'),
  using = require('./using'),
  verifySourcemaps = require('./verify-sourcemaps'),
  isMinSrcDefinedForFile = require('./is-min-src-defined-for-file'),
  isOptionEnabled = require('./is-option-enabled'),
  addBundleResultsToFile = require('./results/add-bundle-results-to-file'),
  BundleKeys = require('./model/bundle-keys');

module.exports.scripts = function (opts) {
  return gulp.src(opts.src, {base: opts.base})
    .pipe(using.bundle(opts.bundleName, BundleKeys.SCRIPTS, opts.env, opts.isBundleAll))
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(opts.bundleOptions.transforms[BundleKeys.SCRIPTS]())
    .pipe(through.obj(verifySourcemaps))
    .pipe(gif(function (file) {
        return !isMinSrcDefinedForFile(file, opts.minSrcs, opts.bundleName, opts.type) &&
          isOptionEnabled(opts.bundleOptions.uglify, opts.env);
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
    .pipe(sourcemaps.write('maps'))
    .pipe(addBundleResultsToFile(opts.bundleName, BundleKeys.SCRIPTS, opts.bundleOptions.result, opts.env, opts.isBundleAll));
};

module.exports.styles = function (opts) {
  return gulp.src(opts.src, {base: opts.base})
    .pipe(using.bundle(opts.bundleName, BundleKeys.STYLES, opts.env, opts.isBundleAll))
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(opts.bundleOptions.transforms[BundleKeys.STYLES]())
    .pipe(through.obj(verifySourcemaps))
    .pipe(gif(function (file) {
      return !isMinSrcDefinedForFile(file, opts.minSrcs, opts.bundleName, opts.type) &&
        isOptionEnabled(opts.bundleOptions.minCSS, opts.env);
    }, minifyCSS()))
    .pipe(concat(opts.bundleName + ((opts.isBundleAll && opts.env) ? '.' + opts.env : '') + '.css'))
    .pipe(gif(isOptionEnabled(opts.bundleOptions.rev, opts.env), rev()))
    .pipe(sourcemaps.write('maps'))
    .pipe(addBundleResultsToFile(opts.bundleName, BundleKeys.STYLES, opts.bundleOptions.result, opts.env, opts.isBundleAll));
};