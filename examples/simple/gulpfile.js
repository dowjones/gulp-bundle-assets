var gulp = require('gulp'),
  rimraf = require('gulp-rimraf'),
  bundleConfig = require('./bundle.config.js');

require('../../')(gulp);

gulp.task('rimraf', function() {
  return gulp.src([bundleConfig.dest, '.gulp-bundle'], { read: false })
    .pipe(rimraf());
});