var gulp = require('gulp'),
  gutil = require('gulp-util'),
  prettyTime = require('pretty-hrtime'),
  using = require('./../using');

module.exports = function (name, start) {
  var hrDuration = process.hrtime(start); // [seconds,nanoseconds]
  var time = prettyTime(hrDuration);
  gutil.log(
    'Finished bundling', '\'' + gutil.colors.green(name) + '\'',
    'after', gutil.colors.magenta(time)
  );
};