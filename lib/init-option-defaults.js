var BundleKeys = require('./model/bundle-keys'),
  gutil = require('gulp-util');

module.exports = function (bundle) {
  bundle[BundleKeys.OPTIONS] = bundle[BundleKeys.OPTIONS] || {};
  bundle[BundleKeys.OPTIONS].transforms = bundle[BundleKeys.OPTIONS].transforms || {};
  bundle[BundleKeys.OPTIONS].transforms[BundleKeys.SCRIPTS] = bundle[BundleKeys.OPTIONS].transforms[BundleKeys.SCRIPTS] || gutil.noop;
  bundle[BundleKeys.OPTIONS].transforms[BundleKeys.STYLES] = bundle[BundleKeys.OPTIONS].transforms[BundleKeys.STYLES] || gutil.noop;
  bundle[BundleKeys.OPTIONS].watch = bundle[BundleKeys.OPTIONS].watch || {};
};