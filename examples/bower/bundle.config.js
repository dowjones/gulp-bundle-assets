module.exports = {
  bundle: {
    vendor: {
      scripts: [
        './bower_components/jquery/dist/jquery.min.js',
        './bower_components/angular/angular.min.js'
      ],
      styles: [
        './bower_components/bootstrap/dist/css/bootstrap.min.css',
        './bower_components/bootstrap/dist/css/bootstrap-theme.min.css'
      ],
      options: {
        uglify: false, // don't minify js since bower already ships with one
        minCSS: false, // don't minify css since bower already ships with one
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