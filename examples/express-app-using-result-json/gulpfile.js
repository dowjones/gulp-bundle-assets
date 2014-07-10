var gulp = require('gulp'),
  rimraf = require('gulp-rimraf'),
  bundler = require('../../index');

gulp.task('bundle', function() {
  return gulp.src('./bundle.config.js')
    .pipe(bundler())
    .pipe(gulp.dest('./')); // dest of bundle.result.json
});

gulp.task('clean', function() {
  return gulp.src('./public', { read: false })
    .pipe(rimraf());
});