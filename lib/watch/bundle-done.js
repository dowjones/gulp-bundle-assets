var gulp = require('gulp'),
  logger = require('../service/logger'),
  colors = require('ansi-colors'),
  prettyTime = require('pretty-hrtime'),
  using = require('./../using');

module.exports = function (name, start) {
  var hrDuration = process.hrtime(start); // [seconds,nanoseconds]
  var time = prettyTime(hrDuration);
  logger.log('Finished bundling', '\'' + colors.green(name) + '\'',
    'after', colors.magenta(time)
  );
};