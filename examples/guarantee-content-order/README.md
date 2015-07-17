# Guarantee Bundle Content Order

The bundle config supports ordering the src files via `gulp-order` syntax (e.g. wildcards, etc). See here for details on syntax: https://github.com/sirlantis/gulp-order

To use simply add your ordering array to the `order` option:

```js
module.exports = {
  bundle: {
    main: {
      scripts: [
        {
          src: './vendor/second.js',
          minSrc: './vendor/second.min.js'
        },
        './a/*.coffee',
        './content/**/*.coffee',
        './content/**/*.js'
      ]
      options: {
        order: {
          scripts: [
            '**/always-first.js', // from /content
            '**/second*.js',      // depending on env, this could be streaming min or non-min file so use trailing *
            '**/third.js',        // compiled from third.coffee
            '**/fourth.js',       // compiled from fourth.coffee
            '!**/always-last.js', // everything else except always-last.js
            '**/always-last.js'   // from /content
          ]
        },
        transforms: {
          scripts: transformHelper.coffee()
        }
      }
    }
  }
};

```

### Examples

* This example [`bundle.config.js`](bundle.config.js#L25)
* full example [`bundle.config.js`](../full/bundle.config.js#L155)
