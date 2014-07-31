var gulp = require('gulp'),
  rimraf = require('gulp-rimraf'),
  bundle = require('../../index');

gulp.task('bundle', ['clean'], function () {
  return gulp.src('./bundle.config.js')
    .pipe(bundle({
      bundleAllEnvironments: true // boolean|string|array (e.g. true, false, 'production', ['production', 'staging'])
    }))
    .pipe(bundle.results({
      dest: './',
      pathPrefix: '/public/'
    }))
    .pipe(gulp.dest('./public'));
});

gulp.task('clean', function () {
  return gulp.src('./public', { read: false })
    .pipe(rimraf());
});