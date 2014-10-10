var lazypipe = require('lazypipe');
var to5 = require('gulp-6to5');

module.exports = {
  bundle: {
    main: {
      scripts: './src/app.js',
      options: {
        uglify: ['production'], // uglify the resulting bundle in prod
        rev: ['production'], // rev the resulting bundle in prod
        transforms: {
          scripts: lazypipe().pipe(to5)
        }
      }
    }
  }
};