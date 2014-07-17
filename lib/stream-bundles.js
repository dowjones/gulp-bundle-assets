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
  gutil = require('gulp-util'),
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

// assume configBase will ALWAYS be defined (and defaulted to '.')
function getCustomBase(configBase, relativeBase) {
  if (!relativeBase) {
    return configBase;
  }
  return path.join(configBase, relativeBase);
}

function bundle(config) {
  var streams = [],
    copyConfig;

  for (var bundleName in config.bundle) {
    if (config.bundle.hasOwnProperty(bundleName)) {

      var namedBundleObj = config.bundle[bundleName];

      for (var type in namedBundleObj) {
        if (namedBundleObj.hasOwnProperty(type)) {

          if (type === BundleType.JS) {
            streams.push(gulp.src(pathifySrcs.call(this, namedBundleObj[BundleType.JS], config.base), {base: config.base})
              .pipe(using(bundleName, 'js'))
              .pipe(sourcemaps.init())
              .pipe(concat(bundleName + '.js'))
              .pipe(uglify()) // todo don't do this on already .min files
              .pipe(sourcemaps.write())
              .pipe(applyResults(bundleName, BundleType.JS)));
          } else if (type === BundleType.CSS) {
            streams.push(gulp.src(pathifySrcs.call(this, namedBundleObj[BundleType.CSS], config.base), {base: config.base})
              .pipe(using(bundleName, 'css'))
              .pipe(sourcemaps.init())
              .pipe(concat(bundleName + '.css'))
              //.pipe(minifyCSS()) // todo fix for source maps
              .pipe(sourcemaps.write())
              .pipe(applyResults(bundleName, BundleType.CSS)));
          } else {
            throw new gutil.PluginError('gulp-bundle-assets', 'Unsupported bundle type "' + bundleName + '". Supported types are "' +
              namedBundleObj[BundleType.JS] + '" and "' + namedBundleObj[BundleType.CSS] + '"');
          }

        }
      }

    }
  }

  copyConfig = config.copy;

  if (copyConfig) {

    if (typeof copyConfig === 'string') {
      streams.push(
        gulp.src(pathifySrcs.call(this, copyConfig, config.base), { base: config.base })
          .pipe(using(copyConfig))
      );
    } else if (Object.prototype.toString.call(copyConfig) === '[object Array]') {
      throw new Error('not implemented!');
    } else if (typeof copyConfig === 'object') {
      streams.push(
        gulp.src(pathifySrcs.call(this, copyConfig.src, config.base), { base: getCustomBase(config.base, copyConfig.base) })
          .pipe(using(copyConfig))
      );
    } else {
      throw new gutil.PluginError('gulp-bundle-assets', 'Unsupported syntax for copy. Should be a string, array or object.');
    }

  }

  return streams;
}

module.exports = bundle;