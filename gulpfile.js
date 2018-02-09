var gulp = require('gulp'),
  mocha = require('gulp-mocha'),
  eslint = require('gulp-eslint'),
  istanbul = require('gulp-istanbul'),
  TEST_FILES = [
    './test/unit/**/*.js',
    './test/integ/**/*.js'
  ];

// Lint all JS
function lint() {
  return gulp.src([
    './lib/**/*.js'
  ].concat(TEST_FILES))
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError()
  );
}

// Test coverage init
function testCoverInit() {
  return gulp.src(['./index.js', './lib/**/*.js'])
    .pipe(istanbul())
    .pipe(istanbul.hookRequire()
  );
}

// Unit tests and coverage
function test() {
  return gulp.src(TEST_FILES)
    .pipe(mocha())
    .pipe(istanbul.writeReports())
    .pipe(istanbul.enforceThresholds({
      thresholds: {
        statements: 95,
        branches: 93,
        functions: 94,
        lines: 96
      },
      coverageDirectory: 'coverage',
      rootDirectory: ''
    })
  );
}

// Export tasks
exports.lint = lint;
exports.test = gulp.series(testCoverInit, test);