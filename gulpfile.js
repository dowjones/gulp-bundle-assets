var gulp   = require('gulp'),
  spawn = require('child_process').spawn,
  path = require('path'),
  mocha = require('gulp-mocha'),
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

gulp.task('test', 'Tests', function() {
  return gulp.src('./test/**/*.js')
    .pipe(mocha({reporter: 'dot'}));
});

gulp.task('test-debug', 'Run unit tests in debug mode', function () {
  spawn('node', [
    '--debug-brk',
    path.join(__dirname, 'node_modules/gulp/bin/gulp.js'),
    'test'
  ], { stdio: 'inherit' });
});

gulp.task('watch', 'Watch files and test on change', function() {
  gulp.watch(['./lib/**/*.js', './test/**/*.js'], ['test']);
});

gulp.task('ci', 'Runs all ci validation checks', ['lint', 'test', 'nice-package']);