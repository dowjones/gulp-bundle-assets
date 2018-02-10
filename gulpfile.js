var gulp = require('gulp'),
  mocha = require('gulp-mocha'),
  eslint = require('gulp-eslint'),
  babel = require('gulp-babel')
  TEST_FILES = [
    './test/unit/**/*.js',
    './test/integ/**/*.js'
  ],
  LIB_FILES = './lib/**/*.js',
  SRC_FILES = './src/**/*.ts';

// Lint all JS
function lint() {
  return gulp.src(TEST_FILES.concat(SRC_FILES))
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

// Type checks
function typecheck() {
  return gulp.src(SRC_FILES)
    .pipe(flow());
}

// Strip types
function compile() {
  return gulp.src(SRC_FILES)
    .pipe(babel({
      presets: ['@babel/preset-flow']
    }))
    .pipe(gulp.dest('./lib'));
}

// Export tasks
exports.compile = compile;
exports.typecheck = typecheck;
exports.lint = lint;
exports.test = gulp.series(compile, test);