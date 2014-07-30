module.exports = {
  bundle: {
    vendor: {
      scripts: [
        './bower_components/jquery/dist/jquery.min.js',
        './bower_components/angular/angular.min.js'
      ],
      styles: [
        './bower_components/bootstrap/dist/css/bootstrap.css',
        './bower_components/bootstrap/dist/css/bootstrap-theme.css'
      ],
      options: {
        uglify: false, // don't minify js since bower already ships with one
        rev: false
      }
    },
    main: {
      scripts: [
        './content/js/one.js',
        './content/js/two.js'
      ],
      styles: './content/**/*.css',
      options: {
        rev: false
      }
    }
  },
  copy: {
    src: './bower_components/bootstrap/dist/fonts/**/*.*',
    base: './bower_components/bootstrap/'
  }
};