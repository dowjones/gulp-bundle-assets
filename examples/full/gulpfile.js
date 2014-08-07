var gulp = require('gulp'),
  rimraf = require('gulp-rimraf'),
  bundle = require('../../index');

gulp.task('bundle', ['clean'], function () {

  //process.env.NODE_ENV = 'production'; // hardcode to always run in production mode

  return gulp.src('./bundle.config.js')
    .pipe(bundle())
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