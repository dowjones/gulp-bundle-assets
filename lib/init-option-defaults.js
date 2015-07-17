var BundleKeys = require('./model/bundle-keys'),
  gutil = require('gulp-util');

module.exports = function (bundle) {
  bundle[BundleKeys.OPTIONS] = bundle[BundleKeys.OPTIONS] || {};
  bundle[BundleKeys.OPTIONS].transforms = bundle[BundleKeys.OPTIONS].transforms || {};
  bundle[BundleKeys.OPTIONS].transforms[BundleKeys.SCRIPTS] = bundle[BundleKeys.OPTIONS].transforms[BundleKeys.SCRIPTS] || gutil.noop;
  bundle[BundleKeys.OPTIONS].transforms[BundleKeys.STYLES] = bundle[BundleKeys.OPTIONS].transforms[BundleKeys.STYLES] || gutil.noop;
  bundle[BundleKeys.OPTIONS].watch = bundle[BundleKeys.OPTIONS].watch || {};
  bundle[BundleKeys.OPTIONS].pluginOptions = bundle[BundleKeys.OPTIONS].pluginOptions || {};
  bundle[BundleKeys.OPTIONS].pluginOptions['gulp-minify-css'] = bundle[BundleKeys.OPTIONS].pluginOptions['gulp-minify-css'] || {};
  bundle[BundleKeys.OPTIONS].pluginOptions['gulp-uglify'] = bundle[BundleKeys.OPTIONS].pluginOptions['gulp-uglify'] || {};
  bundle[BundleKeys.OPTIONS].pluginOptions['gulp-concat'] = bundle[BundleKeys.OPTIONS].pluginOptions['gulp-concat'] || {};
  bundle[BundleKeys.OPTIONS].order = bundle[BundleKeys.OPTIONS].order || {};
};