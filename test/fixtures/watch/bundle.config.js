var coffee = require('gulp-coffee');
var lazypipe = require('lazypipe');
var less = require('gulp-less');
var gif = require('gulp-if');

function stringEndsWith(str, suffix) {
  return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

function isCoffeeFile(file) {
  return stringEndsWith(file.relative, 'coffee');
}

function isLessFile(file) {
  return stringEndsWith(file.relative, 'less');
}

var scriptTransforms = lazypipe()
  .pipe(function () {
    return gif(isCoffeeFile, coffee());
  });

var styleTransforms = lazypipe()
  .pipe(function () {
    return gif(isLessFile, less());
  });

module.exports = {
  bundle: {
    article: {
      scripts: [
        './content/**/*.coffee'
      ],
      styles: [
        './content/**/*.less'
      ],
      options: {
        minCSS: true,
        transforms: {
          scripts: scriptTransforms,
          styles: styleTransforms
        }
      }
    }
  }
};