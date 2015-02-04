var lazypipe = require('lazypipe');
var sass = require('gulp-sass');
var less = require('gulp-less');
var gif = require('gulp-if');
var path = require('path');
var transformHelper = require('../../index.js').transformHelper;

function stringEndsWith(str, suffix) {
  return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

function isSassFile(file) {
  return stringEndsWith(file.relative, 'scss');
}

function isLessFile(file) {
  return stringEndsWith(file.relative, 'less');
}

var styleTransforms = lazypipe()
  .pipe(function() {
    return gif(isSassFile, sass());
  })
  .pipe(function() {
    return gif(isLessFile, less());
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
        {
          src: './bower_components/angular/angular.js',
          minSrc: './bower_components/angular/angular.min.js'
        },
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
        rev: prodLikeEnvs, // file revisioning
        watch: {
          scripts: false, // do not watch for changes since these almost never change
          styles: false
        }
      }
    },
    article: { // mix of file types
      scripts: [
        './lib/article/**/*.js',
        './lib/article/**/*.coffee'
      ],
      styles: [
        './lib/article/**/*.scss',
        './lib/article/**/*.less'
      ],
      options: {
        uglify: prodLikeEnvs,
        minCSS: prodLikeEnvs,
        rev: prodLikeEnvs,
        transforms: {
          scripts: transformHelper.coffee(),
          styles: styleTransforms // stream that will tranform both scss and less
        }
      }
    },
    main: {
      scripts: [ // bundled in order from top to bottom
        './js/app.js',
        './js/controllers.js',
        './js/directives.js',
        './js/filters.js'
      ],
      styles: [
        './styles/legacy.css',
        './styles/main.less' // entry less file which imports others
      ],
      options: {
        uglify: prodLikeEnvs,
        minCSS: prodLikeEnvs,
        rev: prodLikeEnvs,
        transforms: {
          styles: transformHelper.less()
        },
        watch: {
          styles: [
            './styles/legacy.css',
            './styles/**/*.less' // watch ALL less files for changes, but only
                                 // bundle from the main.less file
          ]
        }
      }
    }
  },
  copy: [
    {
      src: './bower_components/bootstrap/dist/fonts/**/*.*',
      base: './bower_components/bootstrap/dist/',
      watch: false
    },
    {
      src: './partials/**/*.*'
    },
    './images/**/*.*'
  ]
};
