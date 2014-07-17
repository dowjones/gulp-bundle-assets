var gulp = require('gulp'),
  rimraf = require('gulp-rimraf'),
  debug = require('gulp-debug'),
  bundle = require('../../');

gulp.task('bundle', function () {
  return gulp.src('./bundle.config.js')
    .pipe(bundle())
    .pipe(gulp.dest('./public'));
});

gulp.task('clean', function () {
  return gulp.src('./public', { read: false })
    .pipe(rimraf());
});