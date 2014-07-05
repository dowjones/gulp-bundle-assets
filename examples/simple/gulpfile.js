var gulp = require('gulp'),
  rimraf = require('gulp-rimraf');
require('../../')(gulp);

gulp.task('rimraf', function() {
  return gulp.src('./public', { read: false })
    .pipe(rimraf());
});