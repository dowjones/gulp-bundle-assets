var coffee = require('gulp-coffee');
var lazypipe = require('lazypipe');
var sass = require('gulp-sass');
var less = require('gulp-less');
var gif = require('gulp-if');

function stringEndsWith(str, suffix) {
  return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

function isCoffeeFile(file) {
  return stringEndsWith(file.relative, 'coffee');
}

function isScssFile(file) {
  return stringEndsWith(file.relative, 'scss');
}

function isLessFile(file) {
  return stringEndsWith(file.relative, 'less');
}

var scriptTransforms = lazypipe()
  .pipe(function() {
    // when using lazy pipe you need to call gulp-if from within an anonymous func
    // https://github.com/robrich/gulp-if#works-great-inside-lazypipe
    return gif(isCoffeeFile, coffee());
  });

var styleTransforms = lazypipe()
  .pipe(function() {
    return gif(isScssFile, sass());
  })
  .pipe(function() {
    return gif(isLessFile, less());
  });

module.exports = {
  bundle: {
    article: {
      scripts: [
        './content/**/*.coffee',
        './content/**/*.js'
      ],
      styles: [
        './content/**/*.scss',
        './content/**/*.less',
        './content/**/*.css'
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