var coffee = require('gulp-coffee');
var lazypipe = require('lazypipe');
var sass = require('gulp-sass');
var gif = require('gulp-if');

var scriptTransforms = lazypipe()
  .pipe(function() {
    return gif(function(file) {
      return file.relative.indexOf('coffee', file.relative.length - 'coffee'.length) !== -1;
    }, coffee());
  });

var styleTransforms = lazypipe()
  .pipe(sass);

module.exports = {
  bundle: {

    article: {
      scripts: [
        './content/**/*.coffee',
        './content/**/*.js'
      ],
      styles: [
        //'./lib/article/**/*.sass',
        './content/**/*.less'
      ],
      options: {
        transforms: {
          scripts: scriptTransforms//,
          //styles: styleTransforms
        }
      }
    }
  }
};