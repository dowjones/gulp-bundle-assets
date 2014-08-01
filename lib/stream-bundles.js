var fs = require('fs'),
  path = require('path'),
  through = require('through2'),
  util = require('util'),
  Bundle = require('./model/bundle'),
  BundleKeys = require('./model/bundle-keys'),
  gulp = require('gulp'),
  concat = require('gulp-concat'),
  using = require('./using'),
  sourcemaps = require('gulp-sourcemaps'),
  uglify = require('gulp-uglify'),
  gutil = require('gulp-util'),
  gif = require('gulp-if'),
  less = require('gulp-less'),
  rev = require('gulp-rev'),
  each = require('lodash').each,
  isEnabled = require('./is-enabled'),
  addBundleResultsToFile = require('./add-bundle-results-to-file'),
  pathifySrc = require('./pathify-config-src'),
  minifyCSS = require('gulp-minify-css');

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

function _bundle(config) {
  var self = this,
    streams = [],
    bundles = config.bundle,
    isBundleAll = config.options && config.options.bundleAllEnvironments,
    env = process.env.NODE_ENV,
    base = (config.options) ? config.options.base : '.'; // can guarantee !!options b/c (config instanceof Config)

  each(Object.keys(bundles), function (bundleName) {

    var namedBundleObj = bundles[bundleName];
    namedBundleObj[BundleKeys.OPTIONS] = namedBundleObj[BundleKeys.OPTIONS] || {};

    each(Object.keys(namedBundleObj), function (type) {

      /* jshint -W035 */
      if (type === BundleKeys.SCRIPTS) {
        streams.push(gulp.src(pathifySrc(namedBundleObj[BundleKeys.SCRIPTS], base, namedBundleObj[BundleKeys.OPTIONS]), {base: base})
          .pipe(using(bundleName, BundleKeys.SCRIPTS, env, isBundleAll))
          .pipe(sourcemaps.init({loadMaps: true}))
          .pipe(concat(bundleName + ((isBundleAll && env) ? '.' + env : '') + '.js')) // todo need to use NODE_ENV as part of file name when bundleAllEnvironments==true
          .pipe(gif(isEnabled(namedBundleObj[BundleKeys.OPTIONS].uglify), uglify()))
          .pipe(gif(isEnabled(namedBundleObj[BundleKeys.OPTIONS].rev), rev()))
          .pipe(sourcemaps.write('maps'))
          .pipe(addBundleResultsToFile(bundleName, BundleKeys.SCRIPTS, env, isBundleAll)));
      } else if (type === BundleKeys.STYLES) {
        streams.push(gulp.src(pathifySrc(namedBundleObj[BundleKeys.STYLES], base, namedBundleObj[BundleKeys.OPTIONS]), {base: base})
          .pipe(using(bundleName, BundleKeys.STYLES, env, isBundleAll))
          .pipe(sourcemaps.init({loadMaps: true}))
          .pipe(gif(isLessFile, less()))
          .pipe(concat(bundleName + ((isBundleAll && env)  ? '.' + env : '') + '.css'))
          //.pipe(minifyCSS()) // todo fix for source maps
          .pipe(gif(isEnabled(namedBundleObj[BundleKeys.OPTIONS].rev), rev()))
          .pipe(sourcemaps.write('maps'))
          .pipe(addBundleResultsToFile(bundleName, BundleKeys.STYLES, env, isBundleAll)));
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

function bundleAllEnvironments(config) {
  var streams = [],
    environments = config.getAllEnvironments(),
    currentEnv = process.env.NODE_ENV;
  process.env.NODE_ENV = ''; // just in case, clear out current env if any
  environments.push(''); // also run bundling with no env set

  each(environments, function(env) {
    process.env.NODE_ENV = env;
    streams = streams.concat(_bundle(config));
  });

  process.env.NODE_ENV = currentEnv; // reset starting env
  return streams;
}

function bundle(config) {
  var streams = [],
    copy = config.copy,
    base = (config.options) ? config.options.base : '.'; // can guarantee !!options b/c (config instanceof Config)

  if (config.bundle) {
    if (config.options && config.options.bundleAllEnvironments) { // can guarantee !!options b/c (config instanceof Config)
      streams = streams.concat(bundleAllEnvironments(config));
    } else {
      streams = streams.concat(_bundle(config));
    }
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