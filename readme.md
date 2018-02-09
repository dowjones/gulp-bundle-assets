# gulp-uf-bundle-assets

This gulp plugin is a fork of [gulp-bundle-assets](https://github.com/dowjones/gulp-bundle-assets) tailored for UserFrosting 4.

_Full credit for this plugin goes to its original creater. Fork was oringally a simple component switch, thought now much of the existing functionality has been gutted._

## Differences

- Replaced [gulp-concat](https://github.com/contra/gulp-concat) with [gulp-concat-css](https://github.com/mariocasciaro/gulp-concat-css) for CSS to fix url rebasing.
- Removed CSS sourcemaps which isn't supported by gulp-concat-css.
- Removed `minSrc` support, as the debug time implementation in UF doesn't support it.
- Removed support for CoffeeScript, SASS, and LESS compilation.
- Removed support for glob paths.


Unit tests are a whole other story. Significant amounts of the out-of-box tests are heavily dependent on the output of used libraries, and as such break easily. They also don't consider platform specific path delimiters, and as such depend on a Unix-like OS.

> Create static asset bundles from a config file: a common interface to combining, minifying, revisioning and more. Stack agnostic. Production ready.

By default uses the following gulp modules under the covers when creating bundles:

1. [gulp-concat](https://github.com/wearefractal/gulp-concat)
2. [gulp-sourcemaps](https://github.com/floridoo/gulp-sourcemaps)
3. [gulp-uglify](https://github.com/terinjokes/gulp-uglify)
4. [gulp-clean-css](https://github.com/scniro/gulp-clean-css)
6. [gulp-rev](https://github.com/sindresorhus/gulp-rev)
7. [gulp-order](https://github.com/sirlantis/gulp-order)
8. [gulp-concat-css](https://github.com/mariocasciaro/gulp-concat-css)

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
  }
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
   `main-8e6d79da08.css
   `main-5f17cd21a6.js
   `vendor-d66b96f539.js
```

## Advanced Usage

Also check out our [api docs](docs/API.md).

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
    "styles": "<link href='main-8e6d79da08.css' media='screen' rel='stylesheet' type='text/css'/>",
    "scripts": "<script src='main-5f17cd21a6.js' type='text/javascript'></script>"
  },
  "vendor": {
    "scripts": "<script src='vendor-d66b96f539.js' type='text/javascript'></script>",
    "styles": "<link href='vendor-23d5c9c6d1.css' media='screen' rel='stylesheet' type='text/css'/>"
  }
}
```

The order of the bundles will be the same as the order in which they were specified in the config.

## License

[MIT](LICENSE)
