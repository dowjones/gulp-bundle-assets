var gulp = require('gulp'),
  del = require('del'),
  bundle = require('../../');

gulp.task('bundle', ['clean'], function () {
  return gulp.src('./bundle.config.js')
    .pipe(bundle())
    .pipe(gulp.dest('./public'));
});

gulp.task('clean', function () {
  return del([
    './public'
  ]);
});