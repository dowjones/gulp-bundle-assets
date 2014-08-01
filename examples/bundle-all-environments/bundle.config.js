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
        useMin: prodLikeEnvs,
        uglify: false,
        rev: prodLikeEnvs
      }
    },
    main: {
      scripts: './content/**/*.js',
      styles: './content/**/*.css',
      options: {
        uglify: prodLikeEnvs,
        rev: prodLikeEnvs
      }
    }
  }
};