var gulp = require('gulp'),
  spawn = require('child_process').spawn,
  mocha = require('gulp-mocha'),
  eslint = require('gulp-eslint'),
  path = require('path'),
  istanbul = require('gulp-istanbul'),
  coverageEnforcer = require('gulp-istanbul-enforcer'),
  TEST_FILES = [
    './test/unit/**/*.js',
    './test/integ/**/*.js'
  ];

// Lint all JS
gulp.task('lint', function () {
  return gulp.src([
    './lib/**/*.js'
  ].concat(TEST_FILES))
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

// Unit tests
gulp.task('test', function () {
  return gulp.src(TEST_FILES)
    .pipe(mocha());
});

// Unit tests and coverage
gulp.task('test-cover', function (cb) {
  gulp.src([
    './index.js',
    './lib/**/*.js'
  ])
    .pipe(istanbul())
    .pipe(istanbul.hookRequire())
    .on('finish', function () {
      gulp.src(TEST_FILES)
        .pipe(mocha())
        .pipe(istanbul.writeReports())
        .on('end', function() {
          var options = {
            thresholds: {
              statements: 95,
              branches: 93,
              functions: 94,
              lines: 96
            },
            coverageDirectory: 'coverage',
            rootDirectory: ''
          };
          gulp.src('.')
            .pipe(coverageEnforcer(options))
            .on('end', cb);
        });
    });
});

// Run unit tests in debug mode
gulp.task('test-debug', function () {
  spawn('node', [
    '--inspect-brk',
    path.join(__dirname, 'node_modules/gulp/bin/gulp.js'),
    'test'
  ], {stdio: 'inherit'});
});

// Watch files and test on change
gulp.task('watch', function () {
  gulp.watch([
    './index.js',
    './lib/**/*.js',
    './test/**/*.js'
  ], ['test']);
});

// Runs all ci validation checks
gulp.task('ci', ['lint', 'test-cover']);