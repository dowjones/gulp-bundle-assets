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
        useMin: 'min', // {(boolean|string|Array)} pre-minified files from bower
        uglify: 'min', // {(boolean|string|Array)} js minification
        minCSS: 'min', // {(boolean|string|Array)} css minification
        rev: true // {(boolean|string|Array)} file revisioning
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
        useMin: 'min',
        // The presence of a minSrc attribute is automatically detected by the bundler and
        // no uglification/minification will ever be run on those files
        uglify: false,
        minCSS: false,
        rev: true
      }
    },
    article: {
      scripts: './lib/article/**/*.js',
      styles: './lib/article/**/*.less', // if you supply .less files they will be compiled to .css for you
      options: {
        uglify: 'min',
        minCSS: 'min',
        rev: 'min'
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
        uglify: 'min',
        minCSS: 'min',
        rev: 'min'
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