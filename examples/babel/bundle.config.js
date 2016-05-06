var lazypipe = require('lazypipe');
var babel = require('gulp-babel');

module.exports = {
  bundle: {
    main: {
      scripts: './src/app.js',
      options: {
        uglify: ['production'], // uglify the resulting bundle in prod
        rev: ['production'], // rev the resulting bundle in prod
        transforms: {
          scripts: lazypipe().pipe(babel, {
              presets: ['es2015']
            }
          )
        }
      }
    }
  }
};