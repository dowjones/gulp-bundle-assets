var gulp = require('gulp-help')(require('gulp')),
  spawn = require('child_process').spawn,
  mocha = require('gulp-mocha'),
  jshint = require('gulp-jshint'),
  path = require('path'),
  nicePackage = require('gulp-nice-package'),
  istanbul = require('gulp-istanbul'),
  coverageEnforcer = require('gulp-istanbul-enforcer'),
  TEST_FILES = [
    './test/unit/**/*.js',
    './test/integ/**/*.js'
  ];

gulp.task('nice-package', 'Validates package.json', function () {
  return gulp.src('package.json')
    .pipe(nicePackage(null, {
      recommendations: false
    }));
});

gulp.task('lint', 'Lint all js', function () {
  return gulp.src([
    './*.js',
    './lib/**/*.js'
  ].concat(TEST_FILES))
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish', {verbose: true}))
    .pipe(jshint.reporter('fail'));
});

gulp.task('test', 'Tests', function () {
  return gulp.src(TEST_FILES)
    .pipe(mocha());
});

gulp.task('test-cover', 'Unit tests and coverage', function (cb) {
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

gulp.task('test-debug', 'Run unit tests in debug mode', function () {
  spawn('node', [
    '--inspect-brk',
    path.join(__dirname, 'node_modules/gulp/bin/gulp.js'),
    'test'
  ], {stdio: 'inherit'});
});

gulp.task('watch', 'Watch files and test on change', function () {
  gulp.watch([
    './index.js',
    './lib/**/*.js',
    './test/**/*.js'
  ], ['test']);
});

gulp.task('ci', 'Runs all ci validation checks', ['lint', 'test-cover', 'nice-package']);