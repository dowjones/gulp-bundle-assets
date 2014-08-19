var fs = require('fs'),
  path = require('path'),
  through = require('through2'),
  util = require('util'),
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
  _ = require('lodash'),
  isOptionEnabled = require('./is-option-enabled'),
  isMinSrcDefinedForFile = require('./is-min-src-defined-for-file'),
  addBundleResultsToFile = require('./add-bundle-results-to-file'),
  pathifySrc = require('./pathify-config-src'),
  minifyCSS = require('gulp-minify-css'),
  stringHelper = require('./string-helper');

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

function isLessFile(file) {
  return stringHelper.endsWith(file.relative, 'less');
}

function initOptionDefaults(bundle) {
  bundle[BundleKeys.OPTIONS] = bundle[BundleKeys.OPTIONS] || {};
  bundle[BundleKeys.OPTIONS].transforms = bundle[BundleKeys.OPTIONS].transforms || {};
  bundle[BundleKeys.OPTIONS].transforms[BundleKeys.SCRIPTS] = bundle[BundleKeys.OPTIONS].transforms[BundleKeys.SCRIPTS] || gutil.noop;
  bundle[BundleKeys.OPTIONS].transforms[BundleKeys.STYLES] = bundle[BundleKeys.OPTIONS].transforms[BundleKeys.STYLES] || gutil.noop;
}

function _bundle(config, env) {
  var streams = [],
    bundles = config.bundle,
    isBundleAll = config.options && config.options.bundleAllEnvironments,
    base = (config.options) ? config.options.base : '.', // can guarantee !!options b/c (config instanceof Config)
    minSrcs = (config.getAllMinSrcs) ? config.getAllMinSrcs() : {};

  if (env) {
    gutil.log('Creating bundle(s) for environment "' + env + '"');
  }

  _.forEach(Object.keys(bundles), function (bundleName) {

    var namedBundleObj = bundles[bundleName];
    initOptionDefaults(namedBundleObj);

    _.forEach(Object.keys(namedBundleObj), function (type) {

      /* jshint -W035 */
      if (type === BundleKeys.SCRIPTS) {

        streams.push(gulp.src(pathifySrc(namedBundleObj[BundleKeys.SCRIPTS], base, namedBundleObj[BundleKeys.OPTIONS], env), {base: base})
          .pipe(using(bundleName, BundleKeys.SCRIPTS, env, isBundleAll))
          .pipe(sourcemaps.init({loadMaps: true}))
          .pipe(namedBundleObj[BundleKeys.OPTIONS].transforms[BundleKeys.SCRIPTS]())
          .pipe(gif(function (file) {
            return !isMinSrcDefinedForFile(file, minSrcs, bundleName, type) &&
              isOptionEnabled(namedBundleObj[BundleKeys.OPTIONS].uglify, env);
          }, uglify()))
          .pipe(concat(bundleName + ((isBundleAll && env) ? '.' + env : '') + '.js'))
          .pipe(gif(isOptionEnabled(namedBundleObj[BundleKeys.OPTIONS].rev, env), rev()))
          .pipe(sourcemaps.write('maps'))
          .pipe(addBundleResultsToFile(bundleName, BundleKeys.SCRIPTS, env, isBundleAll)));
      } else if (type === BundleKeys.STYLES) {
        streams.push(gulp.src(pathifySrc(namedBundleObj[BundleKeys.STYLES], base, namedBundleObj[BundleKeys.OPTIONS], env), {base: base})
          .pipe(using(bundleName, BundleKeys.STYLES, env, isBundleAll))
          .pipe(sourcemaps.init({loadMaps: true}))
          .pipe(namedBundleObj[BundleKeys.OPTIONS].transforms[BundleKeys.STYLES]())
          .pipe(gif(isLessFile, less()))
          .pipe(gif(function (file) {
            return !isMinSrcDefinedForFile(file, minSrcs, bundleName, type) &&
              isOptionEnabled(namedBundleObj[BundleKeys.OPTIONS].minCSS, env);
          }, minifyCSS()))
          .pipe(concat(bundleName + ((isBundleAll && env) ? '.' + env : '') + '.css'))
          .pipe(gif(isOptionEnabled(namedBundleObj[BundleKeys.OPTIONS].rev, env), rev()))
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
    environments = config.getAllEnvironments();
  environments.push(''); // also run bundling with no env set

  _.forEach(environments, function (env) {
    streams = streams.concat(_bundle(config, env));
  });

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
      streams = streams.concat(_bundle(config, process.env.NODE_ENV));
    }
  }

  if (copy) {

    if (typeof copy === 'string') {
      streams.push(getStringCopyStream(copy, base));
    } else if (util.isArray(copy)) {
      _.forEach(copy, function (item) {
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