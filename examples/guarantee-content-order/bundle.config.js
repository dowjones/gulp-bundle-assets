var transformHelper = require('../../index.js').transformHelper;

module.exports = {
  bundle: {
    'ordered-bundle': {
      scripts: [
        {
          src: './vendor/second.js',
          minSrc: './vendor/second.min.js'
        },
        './a/*.coffee',
        './content/**/*.coffee',
        './content/**/*.js'
      ],
      styles: [
        {
          src: './vendor/second.css',
          minSrc: './vendor/second.min.css'
        },
        './a/*.less',
        './content/**/*.less',
        './content/**/*.css'
      ],
      options: {
        order: {
          scripts: [
            '**/always-first.js', // from /content
            '**/second*.js',      // depending on env, this could be streaming min or non-min file so use trailing *
            '**/third.js',        // compiled from third.coffee
            '**/fourth.js',       // compiled from fourth.coffee
            '!**/always-last.js', // everything else except always-last.js
            '**/always-last.js'   // from /content
          ],
          styles: [
            '**/always-first.css',  // from /content
            '**/second*.css',       // depending on env, this could be streaming min or non-min file so use trailing *
            '**/third.css',         // compiled from third.less
            '**/fourth.css',        // compiled from fourth.less
            '!**/always-last.css',  // everything else except always-last.css
            '**/always-last.css'    // from /content
          ]
        },
        useMin: 'production',
        transforms: {
          scripts: transformHelper.coffee(),
          styles: transformHelper.less()
        }
      }
    }
  }
};
