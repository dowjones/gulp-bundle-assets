# [gulp](http://gulpjs.com/)-bundle-assets [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url]

> Create asset (js, css) bundles from a config file leveraging the power of streams

Uses the following gulp modules under the covers when creating bundles:

1. [gulp-concat](https://github.com/wearefractal/gulp-concat)
2. [gulp-sourcemaps](https://github.com/floridoo/gulp-sourcemaps)
3. [gulp-uglify](https://github.com/terinjokes/gulp-uglify)
4. [gulp-less](https://github.com/plus3network/gulp-less)
5. [gulp-rev](https://github.com/sindresorhus/gulp-rev)
6. [gulp-using](https://github.com/jeromedecoster/gulp-using)

## Install

```bash
npm install gulp-bundle-assets --save-dev
```

## Usage

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

see [the examples folder](examples) for more detail

## Options

### base

Type: `string`

Default: `.`

Base directory when resolving src globs. Useful when running gulp tasks from a `gulpfile` outside the project's root.

## Use your bundles

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

[See here for a full example using hogan](examples/express-app-using-result-json/readme.md)

## TODO

[Prioritized list of new features](https://gist.github.com/chmontgomery/9ec07f3ba0344660a43b#todo)

## License

[MIT](http://opensource.org/licenses/MIT) © [Chris Montgomery](http://www.chrismontgomery.info/)

[npm-url]: https://npmjs.org/package/gulp-bundle-assets
[npm-image]: http://img.shields.io/npm/v/gulp-bundle-assets.svg
[travis-image]: https://travis-ci.org/chmontgomery/gulp-bundle-assets.svg?branch=master
[travis-url]: https://travis-ci.org/chmontgomery/gulp-bundle-assets