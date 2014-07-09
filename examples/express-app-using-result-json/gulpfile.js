var gulp = require('gulp'),
  rimraf = require('gulp-rimraf'),
  bundler = require('../../index'),
  bundleConfig = require('./bundle.config.js');

gulp.task('bundle', function() {
  return gulp.src('./bundle.config.js')
    .pipe(bundler())
    .pipe(gulp.dest('./')); // dest of bundle.result.json
});

gulp.task('clean', function() {
  return gulp.src(bundleConfig.dest, { read: false })
    .pipe(rimraf());
});