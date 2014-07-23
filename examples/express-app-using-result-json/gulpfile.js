var gulp = require('gulp'),
  rimraf = require('gulp-rimraf'),
  bundle = require('../../index');

gulp.task('bundle', ['clean'], function() {
  return gulp.src('./bundle.config.js')
    .pipe(bundle())
    .pipe(bundle.results('./'))
    .pipe(gulp.dest('./public'));
});

gulp.task('clean', function() {
  return gulp.src('./public', { read: false })
    .pipe(rimraf());
});