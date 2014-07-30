var prodLikeEnvs = ['production', 'staging']; // when NODE_ENV=staging or NODE_ENV=production
module.exports = {
  bundle: {
    vendor: {
      scripts: [
        {src: './bower_components/jquery/jquery.js', minSrc: './bower_components/jquery/jquery.min.js'},
        {src: './bower_components/angular/angular.js', minSrc: './bower_components/angular/angular.min.js'},
        './bower_components/spin/spin.js'
      ],
      styles: {
        src: './bower_components/bootstrap/dist/css/bootstrap.css',
        minSrc: './bower_components/bootstrap/dist/css/bootstrap.min.css'
      },
      options: {
        useMin: prodLikeEnvs, // pre-minified files
        uglify: false, // never let bundler minify js since bower already ships with minified versions
        rev: prodLikeEnvs // file revisioning
      }
    },
    article: {
      scripts: './lib/article/**/*.js',
      styles: './lib/article/**/*.less', // if you supply .less files they will be compiled to .css for you
      options: {
        uglify: prodLikeEnvs,
        rev: prodLikeEnvs
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
        './styles/**/*.css',
        './styles/**/*.less' // mix of file types
      ],
      options: {
        uglify: prodLikeEnvs,
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