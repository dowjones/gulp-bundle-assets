var _ = require('lodash'),
  CombineStream = require('combine-stream'),
  fs = require('fs'),
  path = require('path'),
  through = require('through2'),
  File = require('vinyl'),
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

function _bundle(config) {
  var streams = [];

  _.forOwn(config.bundle, function (bundle, key) {

    if (bundle.scripts) {
      streams.push(gulp.src(bundle.scripts, {base: '.'})
        .pipe(using(key, 'js'))
        .pipe(sourcemaps.init())
        .pipe(concat(key + '-bundle.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(config.dest)));
    }

    if (bundle.styles) {
      streams.push(gulp.src(bundle.styles, {base: '.'})
        .pipe(using(key, 'css'))
        .pipe(sourcemaps.init())
        .pipe(concat(key + '-bundle.css'))
        //.pipe(minifyCSS()) // todo fix for source maps
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(config.dest)));
    }

    if (bundle.resources) {
      streams.push(gulp.src(bundle.resources, {base: '.'})
        .pipe(using(key))
        .pipe(gulp.dest(config.dest)));
    }

  });

  return new CombineStream(streams);
}

function bundle(file, enc, cb) {
  var self = this,
    config,
    bundlePaths = [];

  if (file.isNull()) {
    this.push(file);
    return cb();
  }

  if (file.isStream()) {
    this.emit('error', new gutil.PluginError('gulp-asset-bundler', 'Streaming not supported'));
    return cb();
  }

  try {
    config = require(file.path); // todo eval contents since we already have it in buffer
  } catch (e) {
    gutil.log(gutil.colors.red('Failed to parse config file'));
    this.emit('error', new gutil.PluginError('gulp-asset-bundler', e));
    return cb();
  }

  _bundle(config)
    .on('data', function(file) {
      //console.log("DATA", file);
      bundlePaths.push(file.relative);
    })
    .on('error', function(err) {
      self.emit('error', new gutil.PluginError('gulp-asset-bundler', err));
      return cb();
    })
    .on('end', function () {
      //console.log('END!@');

      var resultObj = {

      };
      resultObj.bundles = bundlePaths;

      var result = new File({
        path: "bundle.result.json",
        contents: new Buffer(JSON.stringify(resultObj, null, 2))
      });
      self.push(result);
      cb();
    });
}

module.exports = function () {
  return through.obj(bundle);
};