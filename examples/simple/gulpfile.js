var gulp = require('gulp'),
  rimraf = require('gulp-rimraf'),
  bundler = require('../../'),
  bundleConfig = require('./bundle.config.js');

gulp.task('bundle', function() {
  return gulp.src('./bundle.config.js')
    .pipe(bundler());
});

gulp.task('clean', function() {
  return gulp.src(bundleConfig.dest, { read: false })
    .pipe(rimraf());
});

gulp.task('default', function() {
  gulp.watch(['./content/**/*.*'], ['bundle']);
});