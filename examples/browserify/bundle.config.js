var transformHelper = require('../../index.js').transformHelper,
  browserify = require('browserify'),
  sourceStream = require('vinyl-source-stream'),
  isDebug = (process.env.NODE_ENV !== 'production');

var mainStream = function (file, done) {
  browserify({
    // "entries" can either be hard coded or written this way to use the file path.
    // Currently this doesn't support multiple entry points. To do that, you must
    // implement the full lazypipe chain yourself and use merge-stream to
    // collect all files first before passing it to this.
    entries: [file.path],
    debug: isDebug
  })
    // other custom transforms as desired
    //.transform(reactify)
    //.require(vendorLibs)
    .bundle()
    .pipe(sourceStream('app.js')) // convert to gulp stream
    .pipe(done); // make sure to pipe to the "done" stream
};

module.exports = {
  bundle: {
    main: {
      scripts: './lib/main.js',
      options: {
        uglify: ['production'], // uglify the resulting browserify bundle in prod
        rev: ['production'], // rev the resulting browserify bundle in prod
        transforms: {
          scripts: transformHelper.browserify(mainStream)
        }
      }
    }
  }
};