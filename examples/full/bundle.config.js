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

var prodLikeEnvs = ['production', 'staging']; // when NODE_ENV=staging or NODE_ENV=production
module.exports = {
  bundle: {
    header: {
      scripts: [
        './js/header-scripts.js',
        {
          src: './bower_components/jquery/dist/jquery.js',
          minSrc: './bower_components/jquery/dist/jquery.min.js'
        }
      ],
      styles: [
        './styles/header.css',
        {
          src: './bower_components/bootstrap/dist/css/bootstrap.css',
          minSrc: './bower_components/bootstrap/dist/css/bootstrap.min.css'
        }
      ],
      options: {
        useMin: prodLikeEnvs, // {(boolean|string|Array)} pre-minified files from bower
        uglify: prodLikeEnvs, // {(boolean|string|Array)} js minification
        minCSS: prodLikeEnvs, // {(boolean|string|Array)} css minification
        rev: prodLikeEnvs // {(boolean|string|Array)} file revisioning
      }
    },
    vendor: {
      scripts: [
        {src: './bower_components/angular/angular.js', minSrc: './bower_components/angular/angular.min.js'},
        './bower_components/spin/spin.js'
      ],
      styles: {
        src: './bower_components/angular/angular-csp.css',
        minSrc: './bower_components/angular/angular-csp.min.css'
      },
      options: {
        useMin: prodLikeEnvs, // pre-minified files
        // The presence of a minSrc attribute is automatically detected by the bundler and
        // no uglification/minification will ever be run on those files
        uglify: false,
        minCSS: false,
        rev: prodLikeEnvs // file revisioning
      }
    },
    article: {
      scripts: [
        './lib/article/**/*.js',
        './lib/article/**/*.coffee'
      ],
      styles: [
        //'./lib/article/**/*.sass',
        './lib/article/**/*.less'
      ],
      options: {
        uglify: prodLikeEnvs,
        minCSS: prodLikeEnvs,
        rev: prodLikeEnvs,
        transforms: {
          scripts: scriptTransforms,
          styles: styleTransforms
        }
      }
    },
    main: {
      scripts: [
        './js/app.js',
        './js/controllers.js',
        './js/directives.js',
        './js/filters.js'
      ],
      styles: [
        './styles/legacy.css',
        './styles/**/*.less' // mix of file types
      ],
      options: {
        uglify: prodLikeEnvs,
        minCSS: prodLikeEnvs,
        rev: prodLikeEnvs
      }
    }
  },
  copy: [
    {
      src: './bower_components/bootstrap/dist/fonts/**/*.*',
      base: './bower_components/bootstrap/dist/'
    },
    './images/**/*.*'
  ]
};