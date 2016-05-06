var gulp = require('gulp'),
  del = require('del'),
  bundle = require('../../index');

gulp.task('bundle', ['clean'], function () {
  return gulp.src('./bundle.config.js')
    .pipe(bundle())
    .pipe(gulp.dest('./dist'));
});

gulp.task('clean', function () {
  return del([
    './dist'
  ]);
});

gulp.task('default', ['bundle']);