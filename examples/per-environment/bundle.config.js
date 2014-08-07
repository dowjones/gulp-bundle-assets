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
        uglify: false, // never minify js
        minCss: false, // never minify css
        rev: false,
        useMin: ['production', 'staging'] // use pre-minified src only on prod and staging
      }
    },
    one: {
      scripts: './content/js/one.js',
      options: {
        uglify: 'staging', // minify ONLY when NODE_ENV=staging
        rev: 'staging'
      }
    },
    two: {
      scripts: './content/js/two.js',
      options: {
        uglify: ['production', 'staging'], // minify ONLY when NODE_ENV=staging or NODE_ENV=production
        rev: ['production', 'staging']
      }
    },
    threeve: {
      scripts: './content/js/threeve.js',
      options: {
        uglify: true, // minify in all environments
        rev: true
      }
    },
    main: {
      styles: './content/**/*.css'
    }
  }
};