module.exports = {
  bundle: {
    vendor: {
      scripts: [
        {src: './bower_components/jquery/dist/jquery.js', minSrc: './bower_components/jquery/dist/jquery.min.js'},
        {src: './bower_components/angular/angular.js', minSrc: './bower_components/angular/angular.min.js'}
      ],
      styles: {
        src: './bower_components/bootstrap/dist/css/bootstrap.css', minSrc: './bower_components/bootstrap/dist/css/bootstrap.min.css'
      },
      options: {
        uglify: false, // never minify
        useMin: ['production', 'staging'] // use pre-minified src only on prod and staging
      }
    },
    one: {
      scripts: './content/js/one.js',
      options: {
        uglify: 'staging' // minify ONLY when NODE_ENV=staging
      }
    },
    two: {
      scripts: './content/js/two.js',
      options: {
        uglify: ['production', 'staging'] // minify ONLY when NODE_ENV=staging or NODE_ENV=production
      }
    },
    threve: {
      scripts: './content/js/threve.js',
      options: {
        uglify: true // minify in all environments
      }
    },
    main: {
      styles: './content/**/*.css'
    }
  }
};