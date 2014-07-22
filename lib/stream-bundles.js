var fs = require('fs'),
  path = require('path'),
  through = require('through2'),
  util = require('util'),
  Bundle = require('./model/bundle'),
  BundleType = require('./model/bundle-type'),
  gulp = require('gulp'),
  concat = require('gulp-concat'),
  gusing = require('gulp-using'),
  sourcemaps = require('gulp-sourcemaps'),
  uglify = require('gulp-uglify'),
  gutil = require('gulp-util'),
  gif = require('gulp-if'),
  less = require('gulp-less'),
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

/**
 *
 * @param {String} item
 * @param base
 * @returns {*}
 */
function getStringCopyStream(item, base) {
  return gulp.src(pathifySrcs.call(this, item, base), { base: base })
    .pipe(using(item));
}

/**
 * @param {Object} item
 * @param base
 * @returns {*}
 */
function getObjectCopyStream(item, base) {
  return gulp.src(pathifySrcs.call(this, item.src, base), { base: getCustomBase(base, item.base) })
    .pipe(using(item));
}

function getCopyStream(item, base) {
  if (typeof item === 'string') {
    return getStringCopyStream(item, base);
  } else if (typeof item === 'object' && !util.isArray(item)) {
    return getObjectCopyStream(item, base);
  }
  throw new gutil.PluginError('gulp-bundle-assets', 'Unsupported syntax for copy. See here for supported variations: ' +
    'https://github.com/chmontgomery/gulp-bundle-assets/blob/master/examples/copy/bundle.config.js');
}

function endsWith(str, suffix) {
  return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

function isLessFile(file) {
  return endsWith(file.relative, 'less');
}

function bundle(config) {
  var streams = [],
    copyConfig;

  for (var bundleName in config.bundle) {
    if (config.bundle.hasOwnProperty(bundleName)) {

      var namedBundleObj = config.bundle[bundleName];

      for (var type in namedBundleObj) {
        if (namedBundleObj.hasOwnProperty(type)) {

          if (type === BundleType.SCRIPTS) {
            streams.push(gulp.src(pathifySrcs.call(this, namedBundleObj[BundleType.SCRIPTS], config.base), {base: config.base})
              .pipe(using(bundleName, 'js'))
              .pipe(sourcemaps.init())
              .pipe(concat(bundleName + '.js'))
              .pipe(uglify()) // todo don't do this on already .min files
              .pipe(sourcemaps.write())
              .pipe(applyResults(bundleName, BundleType.SCRIPTS)));
          } else if (type === BundleType.STYLES) {
            streams.push(gulp.src(pathifySrcs.call(this, namedBundleObj[BundleType.STYLES], config.base), {base: config.base})
              .pipe(using(bundleName, 'css'))
              .pipe(sourcemaps.init())
              .pipe(gif(isLessFile, less()))
              .pipe(concat(bundleName + '.css'))
              //.pipe(minifyCSS()) // todo fix for source maps
              .pipe(sourcemaps.write())
              .pipe(applyResults(bundleName, BundleType.STYLES)));
          } else {
            throw new gutil.PluginError('gulp-bundle-assets', 'Unsupported bundle type "' + bundleName + '". Supported types are "' +
              namedBundleObj[BundleType.SCRIPTS] + '" and "' + namedBundleObj[BundleType.STYLES] + '"');
          }

        }
      }

    }
  }

  copyConfig = config.copy;

  if (copyConfig) {

    if (typeof copyConfig === 'string') {
      streams.push(getStringCopyStream(copyConfig, config.base));
    } else if (util.isArray(copyConfig)) {
      copyConfig.forEach(function (item) {
        streams.push(getCopyStream(item, config.base));
      });
    } else if (typeof copyConfig === 'object') {
      streams.push(getObjectCopyStream(copyConfig, config.base));
    } else {
      throw new gutil.PluginError('gulp-bundle-assets', 'Unsupported syntax for copy. Should be a string, array or object.');
    }

  }

  return streams;
}

module.exports = bundle;