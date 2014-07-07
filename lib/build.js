var _ = require('lodash'),
  merge = require('merge-stream'),
  gutil = require('gulp-util'),
  fs = require('fs'),
  path = require('path'),
  gulp = require('gulp'),
  concat = require('gulp-concat'),
  chalk = require('chalk'),
  map = require('map-stream'),
  mkdirp = require('mkdirp');

function using(key, bundleList) {
  var options = {
    prefix: 'Using file',
    path: 'relative'
  };

  bundleList[key] = bundleList[key] || [];

  return map(function (file, cb) {
    var f = file.relative;
    gutil.log(options.prefix, key, chalk['magenta'](f));
    bundleList[key].push(f);
    cb(null, file);
  });
}

function bundle(config) {
  var streams = [],
    scriptBundleList = {},
    styleBundleList = {};

  _.forOwn(config.bundle, function (bundle, key) {

    if (bundle.scripts) {
      // prod mode
      streams.push(gulp.src(bundle.scripts, {base: '.'}) // todo base as config?
        .pipe(concat(key + '-bundle.js'))
        .pipe(gulp.dest(config.dest)));

      // dev mode
      streams.push(gulp.src(bundle.scripts, {base: '.'})
        .pipe(using(key, scriptBundleList))
        .on('end', function () {

          mkdirp(path.join(config.dest, '../.gulp-bundle'), function (err) { // todo diff path from /public?
            if (err) throw err;

            fs.writeFile(path.join(config.dest, '../.gulp-bundle/bundles.json'), JSON.stringify(scriptBundleList, null, 2), function (err) {
              if (err) throw err;
            });

          });


        })
        .pipe(gulp.dest(config.dest)));
    }

    if (bundle.styles) {
      // prod mode
      streams.push(gulp.src(bundle.styles, {base: '.'})
        .pipe(concat(key + '-bundle.css'))
        .pipe(gulp.dest(config.dest)));

      // dev mode
      streams.push(gulp.src(bundle.styles, {base: '.'})
        .pipe(using(key, styleBundleList))
        .on('end', function () {

          mkdirp(path.join(config.dest, '../.gulp-bundle'), function (err) { // todo diff path from /public?
            if (err) throw err;

            fs.writeFile(path.join(config.dest, '../.gulp-bundle/bundles-styles.json'), JSON.stringify(styleBundleList, null, 2), function (err) {
              if (err) throw err;
            });

          });


        })
        .pipe(gulp.dest(config.dest)));
    }

    if (bundle.resources) {
      streams.push(gulp.src(bundle.resources, {base: './lib'}) //todo what should base be?
        .pipe(gulp.dest(config.dest)));
    }

  });

  return merge.apply(merge, streams);
}

module.exports = function () {
  var config = require(path.join(process.cwd(), 'bundle.config.js'));
  return bundle(config);
};