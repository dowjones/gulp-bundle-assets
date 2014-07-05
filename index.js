var build = require('./lib/build'),
  gutil = require('gulp-util');

/**
 * @param {Object} gulp
 * @param {Object} options
 */
module.exports = function (gulp, options) {

  if (!gulp) {
    throw new gutil.PluginError('gulp-asset-bundler', 'gulp instance required.');
  }

  gulp.task('build', function () {
    return build(gulp, options);
  });
};