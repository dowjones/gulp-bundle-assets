var lazypipe = require('lazypipe');
var less = require('gulp-less');
var gif = require('gulp-if');
var path = require('path');
var transformHelper = require('../../index.js').transformHelper;

function stringEndsWith(str, suffix) {
  return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

function isLessFile(file) {
  return stringEndsWith(file.relative, 'less');
}

var styleTransforms = lazypipe()
  .pipe(function () {
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
        './lib/article/**/*.less'
      ],
      options: {
        uglify: prodLikeEnvs,
        minCSS: prodLikeEnvs,
        rev: prodLikeEnvs,
        transforms: {
          scripts: transformHelper.coffee(),
          styles: styleTransforms // stream that will transform less
        },
        pluginOptions: { // pass additional options to underlying gulp plugins. By default the options object is empty
          'gulp-cssnano': {processImport: false},
          'gulp-uglify': {mangle: false},
          'gulp-concat': {stat: {mode: 0666}},
          'gulp-sourcemaps': {
            init: {debug: true}, // default is {loadMaps: true}
            write: {addComment: false}, // default is {}
            destPath: 'maps/article', // default is 'maps'
            scripts: {
              init: {loadMaps: false},
              write: {addComment: true} // overrides {addComment: false}
            },
            styles: {
              init: {loadMaps: true},
              destPath: 'maps/article/css' // overrides above 'maps/article'
            }
          }
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
    },
    'jquery-stand-alone': {
      scripts: [
        {
          src: './bower_components/jquery/dist/jquery.js',
          minSrc: './bower_components/jquery/dist/jquery.min.js'
        }
      ],
      options: {
        useMin: prodLikeEnvs,
        uglify: false,
        rev: prodLikeEnvs,
        maps: false // {(boolean)} disable sourcemaps
      }
    },
    'ordered-bundle': {
      scripts: [
        {
          src: './ordered_bundle/bower_components/jquery.js',
          minSrc: './ordered_bundle/bower_components/jquery.min.js'
        },
        './ordered_bundle/vendor/*.js',
        './ordered_bundle/content/*.coffee',
        './ordered_bundle/content/*.js'
      ],
      styles: [
        {
          src: './ordered_bundle/bower_components/bootstrap.css',
          minSrc: './ordered_bundle/bower_components/bootstrap.min.css'
        },
        './ordered_bundle/vendor/*.css',
        './ordered_bundle/content/*.less',
        './ordered_bundle/content/*.css'
      ],
      options: {
        useMin: prodLikeEnvs,
        order: {
          scripts: [
            '**/always-first.js',  // from /content
            '**/jquery*.js',       // depending on env, this could be streaming min or non-min file so use trailing *
            '**/lodash.js',        // from /vendor
            '**/file1.js',         // compiled from file1.coffee
            '**/file2.js',         // compiled from file2.coffee
            '!**/always-last.js',  // everything else except always-last.js
            '**/always-last.js'    // from /content
          ],
          styles: [
            '**/always-first.css',  // from /content
            '**/bootstrap*.css',    // depending on env, this could be streaming min or non-min file so use trailing *
            '**/vendor.css',        // from /vendor
            '**/file1.css',         // compiled from file1.less
            '**/file2.css',         // compiled from file2.less
            '!**/always-last.css',  // everything else except always-last.css
            '**/always-last.css'    // from /content
          ]
        },
        transforms: {
          scripts: transformHelper.coffee(),
          styles: transformHelper.less()
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
