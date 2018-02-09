var util = require('util'),
  BundleKeys = require('./model/bundle-keys'),
  PluginError = require('plugin-error'),
  logger = require('./service/logger'),
  _ = require('lodash'),
  pathifySrc = require('./pathify-config-src'),
  stringHelper = require('./string-helper'),
  initOptionDefaults = require('./init-option-defaults'),
  streamFiles = require('./stream-files'),
  streamCopy = require('./stream-copy'),
  streamBundlesUtil = require('./stream-bundles-util');

function _bundle(config) {
  var streams = [],
    bundles = config.bundle,
    isBundleAll = config.options,
    base = (config.options) ? config.options.base : '.', // can guarantee !!options b/c (config instanceof Config)
    minSrcs = (config.getAllMinSrcs) ? config.getAllMinSrcs() : {};

  _.forEach(Object.keys(bundles), function (bundleName) {

    var namedBundleObj = bundles[bundleName];
    initOptionDefaults(namedBundleObj);

    _.forEach(Object.keys(namedBundleObj), function (type) {

      /* jshint -W035 */
      if (type === BundleKeys.SCRIPTS || type === BundleKeys.STYLES) {
        streams.push(streamFiles[type]({
          src: pathifySrc(namedBundleObj[type], base, namedBundleObj[BundleKeys.OPTIONS]),
          base: base,
          type: type,
          bundleName: bundleName,
          bundleOptions: namedBundleObj[BundleKeys.OPTIONS],
          bundleOrder: Object.keys(bundles),
          isBundleAll: isBundleAll,
          minSrcs: minSrcs
        }));
      } else if (type === BundleKeys.OPTIONS) {
        // ok
      } else {
        throw new PluginError('gulp-bundle-assets', 'Unsupported object key found: "bundle.' +
          bundleName + '.' + type + '". Supported types are "' +
          BundleKeys.SCRIPTS + '", "' + BundleKeys.STYLES + '" and "' + BundleKeys.OPTIONS + '"');
      }
      /* jshint +W035 */

    });

  });

  return streams;
}

function _copy(config) {
  var streams = [],
    copy = config.copy,
    base = (config.options) ? config.options.base : '.'; // can guarantee !!options b/c (config instanceof Config)

  if (typeof copy === 'string') {
    streams.push(streamCopy.getStringCopyStream(copy, base));
  } else if (util.isArray(copy)) {
    _.forEach(copy, function (item) {
      streams.push(streamCopy.getCopyStream(item, base));
    });
  } else if (typeof copy === 'object') {
    streams.push(streamCopy.getObjectCopyStream(copy, base));
  } else {
    streamCopy.throwUnsupportedSyntaxError();
  }

  return streams;
}


function bundle(config) {
  var streams = [];

  if (config.bundle) streams = streams.concat(_bundle(config));

  streamBundlesUtil.warnIfNoBundleProperty(config);

  if (config.copy) streams = streams.concat(_copy(config));

  return streams;
}

module.exports = bundle;
