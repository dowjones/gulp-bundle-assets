# [gulp](http://gulpjs.com/)-bundle-assets [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url]

> Creates asset (js, css) bundles out of a config file

## Install

```shell
npm install gulp-bundle-assets --save-dev
```

## Usage

```js
// gulpfile.js
var gulp = require('gulp'),
  bundle = require('gulp-bundle-assets');

gulp.task('bundle', function() {
  return gulp.src('./bundle.config.js')
    .pipe(bundle());
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
      styles: [
        './content/**/*.css'
      ],
      resources: './content/**/*.{png,svg}'
    }
  },
  dest: './public'
};
```

Then, when you call

```shell
$ gulp bundle
```

It would result in

```
/public
    /content
        /fonts
        /images
    main-bundle.css
    main-bundle.js
```

see `/examples` for more detail

[npm-url]: https://npmjs.org/package/gulp-bundle-assets
[npm-image]: http://img.shields.io/npm/v/gulp-bundle-assets.svg
[travis-image]: https://travis-ci.org/chmontgomery/gulp-bundle-assets.svg?branch=master
[travis-url]: https://travis-ci.org/chmontgomery/gulp-bundle-assets