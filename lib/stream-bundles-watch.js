var through = require('through2'),
  BundleKeys = require('./model/bundle-keys'),
  gulp = require('gulp'),
  using = require('./using'),
  sourcemaps = require('gulp-sourcemaps'),
  gutil = require('gulp-util'),
  gif = require('gulp-if'),
  _ = require('lodash'),
  pathifySrc = require('./pathify-config-src'),
  stringHelper = require('./string-helper'),
  bundleAllEnvironments = require('./bundle-all-environments'),
  bundleDone = require('./watch/bundle-done'),
  initOptionDefaults = require('./init-option-defaults'),
  results = require('./results').incremental,
  streamFiles = require('./stream-files');

function _bundle(config, env) {
  var bundles = config.bundle,
    isBundleAll = config.options && config.options.bundleAllEnvironments,
    base = (config.options) ? config.options.base : '.', // can guarantee !!options b/c (config instanceof Config)
    resultOpts = (config.options) ? config.options.results : null,
    minSrcs = (config.getAllMinSrcs) ? config.getAllMinSrcs() : {};

  if (env) {
    gutil.log('Creating bundle(s) for environment "' + env + '"');
  }

  _.forEach(Object.keys(bundles), function (bundleName) {

    var namedBundleObj = bundles[bundleName];
    initOptionDefaults(namedBundleObj);

    _.forEach(Object.keys(namedBundleObj), function (type) {
      var skipScriptWatch,
        skipStyleWatch,
        scriptsPath,
        stylesPath,
        prettyScriptsBundleName,
        prettyStylesBundleName;

      /* jshint -W035 */
      if (type === BundleKeys.SCRIPTS) {

        skipScriptWatch = namedBundleObj[BundleKeys.OPTIONS].skipWatch[BundleKeys.SCRIPTS];

        if (!skipScriptWatch) {

          scriptsPath = pathifySrc(namedBundleObj[BundleKeys.SCRIPTS], base, namedBundleObj[BundleKeys.OPTIONS], env);
          prettyScriptsBundleName = using.bundleName(bundleName, BundleKeys.SCRIPTS, env, isBundleAll);

          gutil.log("Starting '" + gutil.colors.cyan("watch") + "' for bundle '" + gutil.colors.green(prettyScriptsBundleName) + "'...");

          gulp.watch(scriptsPath)
            .on('change', function (file) {

              var start = process.hrtime();

              streamFiles.scripts({
                src: scriptsPath,
                base: base,
                env: env,
                type: type,
                bundleName: bundleName,
                bundleOptions: namedBundleObj[BundleKeys.OPTIONS],
                isBundleAll: isBundleAll,
                minSrcs: minSrcs
              })
                .pipe(results(resultOpts))
                .pipe(gulp.dest(config.options.dest))
                .pipe(through.obj(function (file, enc, cb) {
                  bundleDone(prettyScriptsBundleName, start);
                }));

            });
        }

      } else if (type === BundleKeys.STYLES) {

        skipStyleWatch = namedBundleObj[BundleKeys.OPTIONS].skipWatch[BundleKeys.STYLES];

        if (!skipStyleWatch) {

          stylesPath = pathifySrc(namedBundleObj[BundleKeys.STYLES], base, namedBundleObj[BundleKeys.OPTIONS], env);
          prettyStylesBundleName = using.bundleName(bundleName, BundleKeys.STYLES, env, isBundleAll);

          gutil.log("Starting '" + gutil.colors.cyan("watch") + "' for bundle '" + gutil.colors.green(prettyStylesBundleName) + "'...");

          gulp.watch(stylesPath)
            .on('change', function (file) {

              var start = process.hrtime();

              streamFiles.styles({
                src: stylesPath,
                base: base,
                env: env,
                type: type,
                bundleName: bundleName,
                bundleOptions: namedBundleObj[BundleKeys.OPTIONS],
                isBundleAll: isBundleAll,
                minSrcs: minSrcs
              })
                .pipe(results(resultOpts))
                .pipe(gulp.dest(config.options.dest))
                .pipe(through.obj(function (file, enc, cb) {
                  bundleDone(prettyStylesBundleName, start);
                }));

            });
        }

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

}

function bundle(config) {
  if (config.bundle) {
    if (config.options && config.options.bundleAllEnvironments) { // can guarantee !!options b/c (config instanceof Config)
      bundleAllEnvironments(config, _bundle);
    } else {
      _bundle(config, process.env.NODE_ENV);
    }
  } else {
    throw new gutil.PluginError('gulp-bundle-assets', 'Missing required config property "bundle"');
  }
}

module.exports = bundle;