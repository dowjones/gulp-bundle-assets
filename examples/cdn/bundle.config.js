module.exports = {
  bundle: {
    vendor: {
      scripts: [
        'googlecdn.com/jquery/latest/jquery.min.js',
        'googlecdn.com/angular/latest/angular.min.js'
      ],
      styles: [
        'bootstrapcdn.com/bootstrap/3.0.0/css/bootstrap.css',
        'bootstrapcdn.com/bootstrap/3.0.0/css/bootstrap-theme.css'
      ]
    },
    main: {
      scripts: [
        './content/js/app.js'
      ],
      styles: './content/**/*.css'
    }
  },
  dest: './public'
};