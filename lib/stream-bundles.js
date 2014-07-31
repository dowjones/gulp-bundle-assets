var fs = require('fs'),
  path = require('path'),
  through = require('through2'),
  util = require('util'),
  Bundle = require('./model/bundle'),
  BundleKeys = require('./model/bundle-keys'),
  gulp = require('gulp'),
  concat = require('gulp-concat'),
  gusing = require('gulp-using'),
  sourcemaps = require('gulp-sourcemaps'),
  uglify = require('gulp-uglify'),
  gutil = require('gulp-util'),
  gif = require('gulp-if'),
  less = require('gulp-less'),
  rev = require('gulp-rev'),
  each = require('lodash').each,
  isEnabled = require('./is-enabled'),
  pathifySrc = require('./pathify-config-src'),
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
  return gulp.src(pathifySrc(item, base), { base: base })
    .pipe(using(item));
}

/**
 * @param {Object} item
 * @param base
 * @returns {*}
 */
function getObjectCopyStream(item, base) {
  return gulp.src(pathifySrc(item.src, base), { base: getCustomBase(base, item.base) })
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

function _bundle(bundles, base) {
  var streams = [];

  each(Object.keys(bundles), function (bundleName) {

    var namedBundleObj = bundles[bundleName];
    namedBundleObj[BundleKeys.OPTIONS] = namedBundleObj[BundleKeys.OPTIONS] || {};

    each(Object.keys(namedBundleObj), function (type) {

      /* jshint -W035 */
      if (type === BundleKeys.SCRIPTS) {
        streams.push(gulp.src(pathifySrc(namedBundleObj[BundleKeys.SCRIPTS], base, namedBundleObj[BundleKeys.OPTIONS]), {base: base})
          .pipe(using(bundleName, BundleKeys.SCRIPTS))
          .pipe(sourcemaps.init({loadMaps: true}))
          .pipe(concat(bundleName + '.js'))
          .pipe(gif(isEnabled.bind(null, namedBundleObj[BundleKeys.OPTIONS].uglify), uglify()))
          .pipe(gif(isEnabled.bind(null, namedBundleObj[BundleKeys.OPTIONS].rev), rev()))
          .pipe(sourcemaps.write('maps'))
          .pipe(applyResults(bundleName, BundleKeys.SCRIPTS)));
      } else if (type === BundleKeys.STYLES) {
        streams.push(gulp.src(pathifySrc(namedBundleObj[BundleKeys.STYLES], base, namedBundleObj[BundleKeys.OPTIONS]), {base: base})
          .pipe(using(bundleName, BundleKeys.STYLES))
          .pipe(sourcemaps.init({loadMaps: true}))
          .pipe(gif(isLessFile, less()))
          .pipe(concat(bundleName + '.css'))
          //.pipe(minifyCSS()) // todo fix for source maps
          .pipe(gif(isEnabled.bind(null, namedBundleObj[BundleKeys.OPTIONS].rev), rev()))
          .pipe(sourcemaps.write('maps'))
          .pipe(applyResults(bundleName, BundleKeys.STYLES)));
      } else if (type === BundleKeys.OPTIONS) {
        // ok
      } else {
        throw new gutil.PluginError('gulp-bundle-assets', 'Unsupported object key found: "bundle.' + bundleName + '.' + type + '". Supported types are "' +
          BundleKeys.SCRIPTS + '", "' + BundleKeys.STYLES + '" and "' + BundleKeys.OPTIONS + '"');
      }
      /* jshint +W035 */

    });

  });

  return streams;
}

function bundle(config) {
  var streams = [],
    bundles = config.bundle,
    copy = config.copy,
    base = (config && config.options) ? config.options.base : null; // can guarantee !!options b/c (config instanceof Config)

  if (bundles) {
    streams = streams.concat(_bundle(bundles, base));
  }

  if (copy) {

    if (typeof copy === 'string') {
      streams.push(getStringCopyStream(copy, base));
    } else if (util.isArray(copy)) {
      copy.forEach(function (item) {
        streams.push(getCopyStream(item, base));
      });
    } else if (typeof copy === 'object') {
      streams.push(getObjectCopyStream(copy, base));
    } else {
      throw new gutil.PluginError('gulp-bundle-assets', 'Unsupported syntax for copy. Should be a string, array or object.');
    }

  }

  return streams;
}

module.exports = bundle;