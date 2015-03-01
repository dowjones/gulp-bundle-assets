var gulp = require('gulp'),
  rimraf = require('gulp-rimraf'),
  path = require('path'),
  bundle = require('../../');

gulp.task('bundle', ['clean'], function () {
  return gulp.src('./bundle.config.js')
    .pipe(bundle())
    .pipe(gulp.dest('./public'));
});

gulp.task('clean', function () {
  return gulp.src('./public', { read: false })
    .pipe(rimraf());
});

// rebuild bundle on change of a source file
gulp.task('watch', function () {
  bundle.watch({
    configPath: path.join(__dirname, 'bundle.config.js'),
    dest: path.join(__dirname, 'public')
  });
});