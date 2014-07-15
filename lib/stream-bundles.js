var fs = require('fs'),
  path = require('path'),
  through = require('through2'),
  Bundle = require('./model/bundle'),
  BundleType = require('./model/bundle-type'),
  gulp = require('gulp'),
  concat = require('gulp-concat'),
  gusing = require('gulp-using'),
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

function pathifyStringSrc(src, base) {
  if (base !== '.') {
    return path.join(base, src);
  }
  return src;
}

function pathifySrcs(srcs, base) {
  if (typeof srcs === 'string') {
    return pathifyStringSrc.call(this, srcs, base);
  } else if (Object.prototype.toString.call(srcs) === '[object Array]') {
    for (var i = 0; i < srcs.length; i++) {
      srcs[i] = pathifyStringSrc.call(this, srcs[i], base);
    }
    return srcs;
  }
  throw new Error('Invalid bundle glob detected. Expected string or Array but got ' + srcs);
}

function bundle(config) {
  var streams = [];

  for (var key in config.bundle) {
    if (config.bundle.hasOwnProperty(key)) {

      var bundle = config.bundle[key];

      if (bundle[BundleType.JS]) {
        streams.push(gulp.src(pathifySrcs.call(this, bundle[BundleType.JS], config.base), {base: config.base})
          .pipe(using(key, 'js'))
          .pipe(sourcemaps.init())
          .pipe(concat(key + '.js'))
          .pipe(uglify()) // todo don't do this on already .min files
          .pipe(sourcemaps.write())
          .pipe(applyResults(key, BundleType.JS)));
      }

      if (bundle[BundleType.CSS]) {
        streams.push(gulp.src(pathifySrcs.call(this, bundle[BundleType.CSS], config.base), {base: config.base})
          .pipe(using(key, 'css'))
          .pipe(sourcemaps.init())
          .pipe(concat(key + '.css'))
          //.pipe(minifyCSS()) // todo fix for source maps
          .pipe(sourcemaps.write())
          .pipe(applyResults(key, BundleType.CSS)));
      }

      if (bundle.resources) {
        streams.push(gulp.src(bundle.resources, {base: config.base})
          .pipe(using(key)));
      }

    }
  }

  return streams;
}

module.exports = bundle;