var _ = require('lodash'),
  merge = require('merge-stream'),
  fs = require('fs'),
  path = require('path'),
  gulp = require('gulp'),
  concat = require('gulp-concat'),
  gusing = require('gulp-using');

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
      streams.push(gulp.src(bundle.scripts, {base: '.'}) // todo base as config?
        .pipe(using(key, 'js'))
        .pipe(concat(key + '-bundle.js')) // todo src maps
        .pipe(gulp.dest(config.dest)));
    }

    if (bundle.styles) {
      streams.push(gulp.src(bundle.styles, {base: '.'})
        .pipe(using(key, 'css'))
        .pipe(concat(key + '-bundle.css')) // todo src maps
        .pipe(gulp.dest(config.dest)));
    }

    if (bundle.resources) {
      streams.push(gulp.src(bundle.resources, {base: '.'})
        .pipe(using(key))
        .pipe(gulp.dest(config.dest)));
    }

  });

  return merge.apply(merge, streams);
}

module.exports = function () {
  var config = require(path.join(process.cwd(), 'bundle.config.js'));
  return bundle(config);
};