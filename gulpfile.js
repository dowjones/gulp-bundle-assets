var gulp   = require('gulp'),
  jshint = require('gulp-jshint'),
  nicePackage = require('gulp-nice-package'),
  shrinkwrap = require('gulp-shrinkwrap');

require('gulp-help')(gulp);

gulp.task('nice-package', 'Validates package.json', function() {
  return gulp.src('package.json')
    .pipe(nicePackage(null, {
      warnings: false,
      recommendations: false
    }));
});

gulp.task('shrinkwrap', 'Cleans package.json deps and generates npm-shrinkwrap.json', function () {
  return gulp.src('package.json')
    .pipe(shrinkwrap())
    .pipe(gulp.dest('./'));
});

gulp.task('lint', 'Lint all js', function() {
  return gulp.src('./*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('ci', 'Runs all ci validation checks', ['lint', 'nice-package']);