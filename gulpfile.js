var gulp = require('gulp'),
  tslint = require('gulp-tslint'),
  typescript = require('gulp-typescript'),
  sourcemaps = require('gulp-sourcemaps'),
  childProcess = require('child_process'),
  del = require('del'),
  glob = require('glob'),
  arrDiff = require('arr-diff'),
  TEST_FILES = './lib/**/*.test.js',
  LIB_FILES = './lib/**/*.js',
  SRC_FILES = './src/**/*.ts';

// Lint all JS
function lint() {
  return gulp.src(SRC_FILES)
    .pipe(tslint({
      tslint: require("tslint"),
      formatter: "stylish"
    }))
    .pipe(tslint.report({
      emitError: false
    }));
}

// Unit tests and coverage
function test() {
  // The double quotes force the entire thing to be considered a command.
  // Needs to be xplat tested.
  return childProcess.spawn("\"node_modules/.bin/jest\"", [], {
    shell: true,
    stdio: 'inherit'
  });
}

// Strip types
// Make this incremental
function compile() {
  // Delete files at will no longer be needed (clean up if needed)
  let src = glob.sync(SRC_FILES);
  src.forEach((v, i, a) => {a[i] = v.replace('ts', 'js').replace('src', 'lib');});
  del.sync(arrDiff(glob.sync(LIB_FILES), src));

  // Task proper
  return gulp.src(SRC_FILES)
    .pipe(sourcemaps.init())
    .pipe(typescript({
      target: "ES5"
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./lib'));
}

// Export tasks)
exports.compile = compile;
exports.lint = lint;
exports.test = gulp.series(compile, test);