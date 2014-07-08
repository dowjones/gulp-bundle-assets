var _ = require('lodash'),
  merge = require('merge-stream'),
  fs = require('fs'),
  path = require('path'),
  through = require('through2'),
  gulp = require('gulp'),
  concat = require('gulp-concat'),
  gusing = require('gulp-using'),
  gutil = require('gulp-util'),
  sourcemaps = require('gulp-sourcemaps'),
  uglify = require('gulp-uglify'),
  minifyCSS = require('gulp-minify-css');

function using(key, type) {
  var bundleName = key + '.' + type;
  var prefix = type ? 'Bundle "' + bundleName  + '" using' : 'Copy file';
  return gusing({
    prefix: prefix
  });
}

function bundle(config) {
  var streams = [];

  _.forOwn(config.bundle, function (bundle, key) {

    if (bundle.scripts) {
      streams.push(gulp.src(bundle.scripts) // todo base as config?
        .pipe(using(key, 'js'))
        .pipe(sourcemaps.init())
        .pipe(concat(key + '-bundle.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(config.dest))); // todo out bundle.json
    }

    if (bundle.styles) {
      streams.push(gulp.src(bundle.styles, {base: '.'})
        .pipe(using(key, 'css'))
        .pipe(sourcemaps.init())
        .pipe(concat(key + '-bundle.css'))
        //.pipe(minifyCSS()) // todo fix for source maps
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(config.dest))); // todo out bundle.json
    }

    if (bundle.resources) {
      streams.push(gulp.src(bundle.resources, {base: '.'})
        .pipe(using(key))
        .pipe(gulp.dest(config.dest)));
    }

  });

  return merge.apply(merge, streams);
}

function startBundler(file, enc, cb) {

  if (file.isNull()) {
    this.push(file);
    return cb();
  }

  if (file.isStream()) {
    this.emit('error', new gutil.PluginError('gulp-asset-bundler', 'Streaming not supported'));
    return cb();
  }

  var config;

  try {
    config = require(file.path); // todo eval contents since we already have it in buffer
  } catch (e) {
    gutil.log(gutil.colors.red('Failed to parse config file'));
    this.emit('error', new gutil.PluginError('gulp-asset-bundler', e));
    return cb();
  }

  bundle(config);

  this.push(file);
  cb();
}

module.exports = function () {
  return through.obj(startBundler);
};