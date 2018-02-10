var gulp = require('gulp'),
  mocha = require('gulp-mocha'),
  eslint = require('gulp-eslint'),
  TEST_FILES = [
    './test/unit/**/*.js',
    './test/integ/**/*.js'
  ];

// Lint all JS
function lint() {
  return gulp.src([
    '**/*.js',
    '!node_modules/**'
  ])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError()
  );
}

// Unit tests and coverage
function test() {
  return gulp.src(TEST_FILES)
    .pipe(mocha());
}

// Export tasks
exports.lint = lint;
exports.test = test;