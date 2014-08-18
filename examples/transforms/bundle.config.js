var coffee = require('gulp-coffee');
var lazypipe = require('lazypipe');
var sass = require('gulp-sass');
var gif = require('gulp-if');

function isCoffeeFile(file) {
  return file.relative.indexOf('coffee', file.relative.length - 'coffee'.length) !== -1;
}

function isSassFile(file) {
  return file.relative.indexOf('sass', file.relative.length - 'sass'.length) !== -1;
}

var scriptTransforms = lazypipe()
  .pipe(function() {
    // when using lazy pipe you need to call gulp-if from within an anonymous func
    // https://github.com/robrich/gulp-if#works-great-inside-lazypipe
    return gif(isCoffeeFile, coffee());
  });

var styleTransforms = lazypipe()
  .pipe(function() {
    return gif(isSassFile, sass());
  });

module.exports = {
  bundle: {
    article: {
      scripts: [
        './content/**/*.coffee',
        './content/**/*.js'
      ],
      styles: [
        './lib/article/**/*.sass',
        './content/**/*.less'
      ],
      options: {
        transforms: {
          scripts: scriptTransforms,
          styles: styleTransforms
        }
      }
    }
  }
};