# [gulp](http://gulpjs.com/)-bundle-assets [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage Status][coverage-image]][coverage-url]

> Create asset (js, css) bundles from a config file leveraging the power of streams

Uses the following gulp modules under the covers when creating bundles:

1. [gulp-concat](https://github.com/wearefractal/gulp-concat)
2. [gulp-sourcemaps](https://github.com/floridoo/gulp-sourcemaps)
3. [gulp-uglify](https://github.com/terinjokes/gulp-uglify)
4. [gulp-minify-css](https://github.com/jonathanepollack/gulp-minify-css)
6. [gulp-rev](https://github.com/sindresorhus/gulp-rev)

## Install

```bash
$ npm install gulp-bundle-assets --save-dev
```

## Basic Usage

Create the following files:

```js
// gulpfile.js
var gulp = require('gulp'),
  bundle = require('gulp-bundle-assets');

gulp.task('bundle', function() {
  return gulp.src('./bundle.config.js')
    .pipe(bundle())
    .pipe(gulp.dest('./public'));
});
```

```js
// bundle.config.js
module.exports = {
  bundle: {
    main: {
      scripts: [
        './content/js/foo.js',
        './content/js/baz.js'
      ],
      styles: './content/**/*.css'
    },
    vendor: {
      scripts: './bower_components/angular/angular.js'
    }
  },
  copy: './content/**/*.{png,svg}'
};
```

Then, calling

```bash
$ gulp bundle
```

Will result in the following folder structure:

```
-- public
   |-- content
   |   |-- fonts
   |   |-- images
   `main-8e6d79da.css
   `main-5f17cd21.js
   `vendor-d66b96f5.js
```

## Advanced Usage

See [the examples folder](examples) for many other config options. The [full example](examples/full) shows most 
all available options.

## Options

### base

Type: `string`

Default: `.`

Base directory when resolving src globs. Useful when running gulp tasks from a `gulpfile` outside the project's root.

### bundleAllEnvironments

Type: `boolean`

Default: `false`

When `true`, generates all bundles and bundle result jsons for all environments.
This will parse your `bundle.config.js` looking for all environment definitions.
See [this example](examples/bundle-all-environments) to see the flag in action.

## Integrating bundles into your app

You can programmatically render your bundles into your view via 
[your favorite templating engine](https://www.google.com/webhp?ion=1&espv=2&ie=UTF-8#q=node%20js%20templating%20engine)
and the resulting `bundle.result.json` file. To generate the `bundle.result.json`, add a call to `bundle.results`:

```js
// gulpfile.js
var gulp = require('gulp'),
  bundle = require('gulp-bundle-assets');
  
gulp.task('bundle', function() {
  return gulp.src('./bundle.config.js')
    .pipe(bundle())
    .pipe(bundle.results('./')) // arg is destination of bundle.result.json
    .pipe(gulp.dest('./public'));
});
```

Which results in a `bundle.result.json` file similar to:

```json
{
  "main": {
    "styles": "<link href='/public/main-8e6d79da.css' media='screen' rel='stylesheet' type='text/css'/>",
    "scripts": "<script src='/public/main-5f17cd21.js' type='text/javascript'></script>"
  },
  "vendor": {
    "scripts": "<script src='/public/vendor-d66b96f5.js' type='text/javascript'></script>",
    "styles": "<link href='/public/vendor-23d5c9c6.css' media='screen' rel='stylesheet' type='text/css'/>"
  }
}
```

[See here for a full example using hogan](examples/express-app-using-result-json/readme.md)

## Other Features

1. [different bundles for different environments](examples/per-environment)
    * e.g. `NODE_ENV=production gulp bundle` could produce a set of bundles with minified src while just `gulp bundle` would have unminified src  
2. [custom gulp transforms](examples/custom-transforms/readme.md)
    * e.g. use `gulp-less`, `gulp-sass`, `gulp-coffee`, etc to further transform your files
3. [consume pre-minified src files](examples/full)
    * e.g. use jquery.min.js in production and jquery.js in dev
4. [custom result types](examples/custom-result)
    * e.g. create a bundle.result.json for html, jsx or any custom results you can think of
5. [works alongside 3rd party transformers](examples/browserify)
    * e.g. create a bundle using [browserify](www.browserify.org)

## License

[MIT](http://opensource.org/licenses/MIT) © [Chris Montgomery](http://www.chrismontgomery.info/)

[npm-url]: https://npmjs.org/package/gulp-bundle-assets
[npm-image]: http://img.shields.io/npm/v/gulp-bundle-assets.svg
[travis-image]: https://travis-ci.org/chmontgomery/gulp-bundle-assets.svg?branch=master
[travis-url]: https://travis-ci.org/chmontgomery/gulp-bundle-assets
[coverage-image]: https://img.shields.io/coveralls/chmontgomery/gulp-bundle-assets.svg
[coverage-url]: https://coveralls.io/r/chmontgomery/gulp-bundle-assets