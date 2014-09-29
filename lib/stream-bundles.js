var path = require('path'),
  util = require('util'),
  BundleKeys = require('./model/bundle-keys'),
  gulp = require('gulp'),
  using = require('./using'),
  gutil = require('gulp-util'),
  logger = require('./service/logger'),
  _ = require('lodash'),
  pathifySrc = require('./pathify-config-src'),
  stringHelper = require('./string-helper'),
  bundleAllEnvironments = require('./bundle-all-environments'),
  initOptionDefaults = require('./init-option-defaults'),
  streamFiles = require('./stream-files'),
  warnPrefix = gutil.colors.bgYellow.black('WARN');

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
    .pipe(using.copy(base));
}

/**
 * @param {Object} item
 * @param base
 * @returns {*}
 */
function getObjectCopyStream(item, base) {
  return gulp.src(pathifySrc(item.src, base), { base: getCustomBase(base, item.base) })
    .pipe(using.copy(base));
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

function _bundle(config, env) {
  var streams = [],
    bundles = config.bundle,
    isBundleAll = config.options && config.options.bundleAllEnvironments,
    base = (config.options) ? config.options.base : '.', // can guarantee !!options b/c (config instanceof Config)
    minSrcs = (config.getAllMinSrcs) ? config.getAllMinSrcs() : {};

  if (env) {
    logger.log('Creating bundle(s) for environment "' + env + '"');
  }

  _.forEach(Object.keys(bundles), function (bundleName) {

    var namedBundleObj = bundles[bundleName];
    initOptionDefaults(namedBundleObj);

    _.forEach(Object.keys(namedBundleObj), function (type) {

      /* jshint -W035 */
      if (type === BundleKeys.SCRIPTS || type === BundleKeys.STYLES) {
        streams.push(streamFiles[type]({
          src: pathifySrc(namedBundleObj[type], base, namedBundleObj[BundleKeys.OPTIONS], env),
          base: base,
          env: env,
          type: type,
          bundleName: bundleName,
          bundleOptions: namedBundleObj[BundleKeys.OPTIONS],
          isBundleAll: isBundleAll,
          minSrcs: minSrcs
        }));
      } else if (type === BundleKeys.OPTIONS) {
        // ok
      } else {
        throw new gutil.PluginError('gulp-bundle-assets', 'Unsupported object key found: "bundle.' +
          bundleName + '.' + type + '". Supported types are "' +
          BundleKeys.SCRIPTS + '", "' + BundleKeys.STYLES + '" and "' + BundleKeys.OPTIONS + '"');
      }
      /* jshint +W035 */

    });

  });

  return streams;
}


function bundle(config) {
  var streams = [],
    copy = config.copy,
    base = (config.options) ? config.options.base : '.'; // can guarantee !!options b/c (config instanceof Config)

  if (config.bundle) {
    if (config.options && config.options.bundleAllEnvironments) { // can guarantee !!options b/c (config instanceof Config)
      streams = streams.concat(bundleAllEnvironments(config, _bundle));
    } else {
      streams = streams.concat(_bundle(config, process.env.NODE_ENV));
    }
  } else if (config && config.file && config.file.relative) { // can guarantee !!file b/c (config instanceof Config)
    // replace with gulp logger once they're done with it https://github.com/gulpjs/gulp-util/issues/33
    logger.log(warnPrefix, "No '" + gutil.colors.cyan('bundle') +
      "' property found in " + gutil.colors.magenta(config.file.relative) + ". Did you mean to define one?");
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