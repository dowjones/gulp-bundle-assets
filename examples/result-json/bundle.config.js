module.exports = {
  bundle: {
    main: {
      scripts: [
        './content/js/baz.js',
        './content/js/foo.js'
      ],
      styles: './content/**/*.css'
    },
    vendor: {
      scripts: [
        './bower_components/jquery/dist/jquery.js',
        './bower_components/angular/angular.js'
      ],
      styles: [
        './bower_components/bootstrap/dist/css/bootstrap.css',
        './bower_components/bootstrap/dist/css/bootstrap-theme.css'
      ]
    },
    customJs: {
      scripts: './content/js/custom.js'
    }
  }
};