module.exports = {
  bundle: {
    vendor: {
      js: [
        './bower_components/jquery/dist/jquery.js',
        './bower_components/angular/angular.js'
      ],
      css: [
        './bower_components/bootstrap/dist/css/bootstrap.css',
        './bower_components/bootstrap/dist/css/bootstrap-theme.css'
      ],
      resources: './bower_components/bootstrap/dist/fonts/**/*.*'
    },
    main: {
      js: [
        './content/js/one.js',
        './content/js/two.js'
      ],
      css: './content/**/*.css'
    }
  },
  dest: './public'
};