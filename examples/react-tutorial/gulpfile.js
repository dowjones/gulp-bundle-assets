var gulp = require('gulp'),
  rimraf = require('gulp-rimraf'),
  bundle = require('../../');

gulp.task('bundle', ['clean'], function () {
  return gulp.src('./bundle.config.js')
    .pipe(bundle())
    .pipe(bundle.results({
      pathPrefix: '/public/'
    }))
    .pipe(gulp.dest('./public'));
});

gulp.task('clean', function () {
  return gulp.src('./public', { read: false })
    .pipe(rimraf());
});