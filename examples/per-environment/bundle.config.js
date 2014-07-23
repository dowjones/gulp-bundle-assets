module.exports = {
  bundle: {
    vendor: {
      scripts: [
        './bower_components/jquery/dist/jquery.min.js',
        './bower_components/angular/angular.min.js'
      ],
      options: {
        uglify: false // never minify
      }
    },
    one: {
      scripts: './content/js/one.js',
      options: {
        uglify: "staging" // minify ONLY when NODE_ENV=staging
      }
    },
    two: {
      scripts: './content/js/two.js',
      options: {
        uglify: ["production", "staging"] // minify ONLY when NODE_ENV=staging or NODE_ENV=production
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