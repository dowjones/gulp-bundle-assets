var gulp = require('gulp'),
  rimraf = require('gulp-rimraf'),
  bundle = require('../../index');

gulp.task('bundle', ['clean'], function () {
  return gulp.src('./bundle.config.js')
    .pipe(bundle())
    .pipe(bundle.results('./'))
    // also valid as object
    //.pipe(bundle.results({
    //  dest: './',
    //  pathPrefix: '/'
    // }))
    .pipe(gulp.dest('./public'));
});

gulp.task('clean', function () {
  return gulp.src('./public', { read: false })
    .pipe(rimraf());
});