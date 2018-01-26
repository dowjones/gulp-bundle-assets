var gulp = require('gulp'),
  logger = require('../service/logger'),
  gutil = require('gulp-util'),
  prettyTime = require('pretty-hrtime'),
  using = require('./../using');

module.exports = function (name, start, callback, file) {
  var hrDuration = process.hrtime(start); // [seconds,nanoseconds]
  var time = prettyTime(hrDuration);
  logger.log('Finished bundling', '\'' + gutil.colors.green(name) + '\'',
    'after', gutil.colors.magenta(time)
  );

  if (callback && typeof callback === 'function') {
    callback(file);
  }
};
