var bundle = require('./lib/bundle'),
  gutil = require('gulp-util');

module.exports = function (gulp, options) {

  if (!gulp) {
    throw new gutil.PluginError('gulp-asset-bundler', 'gulp instance required.');
  }

  gulp.task('bundle', function () {
    return bundle(gulp, options);
  });
};