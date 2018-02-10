var BundleKeys = require('./model/bundle-keys'),
  PluginError = require('plugin-error'),
  _ = require('lodash'),
  pathifySrc = require('./pathify-config-src'),
  initOptionDefaults = require('./init-option-defaults'),
  streamFiles = require('./stream-files'),
  streamBundlesUtil = require('./stream-bundles-util');

function _bundle(config) {
  var streams = [],
    bundles = config.bundle,
    base = (config.options) ? config.options.base : '.'; // can guarantee !!options b/c (config instanceof Config)

  _.forEach(Object.keys(bundles), function (bundleName) {

    var namedBundleObj = bundles[bundleName];
    initOptionDefaults(namedBundleObj);

    _.forEach(Object.keys(namedBundleObj), function (type) {

      if (type === BundleKeys.SCRIPTS || type === BundleKeys.STYLES) {
        streams.push(streamFiles[type]({
          src: pathifySrc(namedBundleObj[type], base),
          base: base,
          type: type,
          bundleName: bundleName,
          bundleOptions: namedBundleObj[BundleKeys.OPTIONS],
          bundleOrder: Object.keys(bundles)
        }));
      } else if (type === BundleKeys.OPTIONS) {
        // ok
      } else {
        throw new PluginError('gulp-bundle-assets', 'Unsupported object key found: "bundle.' +
          bundleName + '.' + type + '". Supported types are "' +
          BundleKeys.SCRIPTS + '", "' + BundleKeys.STYLES + '" and "' + BundleKeys.OPTIONS + '"');
      }

    });

  });

  return streams;
}

function bundle(config) {
  var streams = [];

  if (config.bundle) streams = streams.concat(_bundle(config));

  streamBundlesUtil.warnIfNoBundleProperty(config);

  return streams;
}

module.exports = bundle;
