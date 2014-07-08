var gulp = require('gulp'),
  rimraf = require('gulp-rimraf'),
  bundleConfig = require('./bundle.config.js');

require('../../')(gulp);

gulp.task('clean', function() {
  return gulp.src(bundleConfig.dest, { read: false })
    .pipe(rimraf());
});

gulp.task('default', function() {
  gulp.watch(['./content/**/*.*'], ['bundle']);
});