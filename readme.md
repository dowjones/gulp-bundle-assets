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

## Advanced Usage

See [the examples folder](examples) for many other config options.

Given a `bundle.config.js`

```js
var prodLikeEnvs = ['production', 'staging']; // when NODE_ENV=staging or NODE_ENV=production
module.exports = {
  bundle: {
    vendor: {
      scripts: [
        {src: './bower_components/jquery/jquery.js', minSrc: './bower_components/jquery/jquery.min.js'},
        {src: './bower_components/angular/angular.js', minSrc: './bower_components/angular/angular.min.js'},
        './bower_components/spin/spin.js'
      ],
      styles: {
        src: './bower_components/bootstrap/dist/css/bootstrap.css',
        minSrc: './bower_components/bootstrap/dist/css/bootstrap.min.css'
      },
      options: {
        useMin: prodLikeEnvs, // pre-minified files
        uglify: false, // never let bundler minify js since bower already ships with minified versions
        rev: prodLikeEnvs // file revisioning
      }
    },
    article: {
      scripts: './lib/article/**/*.js',
      styles: './lib/article/**/*.less', // if you supply .less files they will be compiled to .css for you
      options: {
        uglify: prodLikeEnvs,
        rev: prodLikeEnvs
      }
    },
    main: {
      scripts: [
        './js/app.js',
        './js/controllers.js',
        './js/directives.js',
        './js/filters.js'
      ],
      styles: [
        './styles/**/*.css',
        './styles/**/*.less' // mix of file types
      ],
      options: {
        uglify: prodLikeEnvs,
        rev: prodLikeEnvs
      }
    }
  },
  copy: [
    {
      src: './bower_components/bootstrap/dist/fonts/**/*.*',
      base: './bower_components/bootstrap/dist/'
    },
    './images/**/*.*'
  ]
};
```

Running

```bash
$ NODE_ENV=production gulp bundle
```

Will result in

```json
{
  "article": {
    "styles": "<link href='/public/article-c2107e48.css' media='screen' rel='stylesheet' type='text/css'/>",
    "scripts": "<script src='/public/article-d41d8cd9.js' type='text/javascript'></script>"
  },
  "vendor": {
    "styles": "<link href='/public/vendor-bfff3428.css' media='screen' rel='stylesheet' type='text/css'/>",
    "scripts": "<script src='/public/vendor-fc7efeba.js' type='text/javascript'></script>"
  },
  "main": {
    "styles": "<link href='/public/main-41e43699.css' media='screen' rel='stylesheet' type='text/css'/>",
    "scripts": "<script src='/public/main-d41d8cd9.js' type='text/javascript'></script>"
  }
}
```

## Options

### base

Type: `string`

Default: `.`

Base directory when resolving src globs. Useful when running gulp tasks from a `gulpfile` outside the project's root.

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

## TODO

[Prioritized list of new features](https://gist.github.com/chmontgomery/9ec07f3ba0344660a43b#todo)

## License

[MIT](http://opensource.org/licenses/MIT) © [Chris Montgomery](http://www.chrismontgomery.info/)

[npm-url]: https://npmjs.org/package/gulp-bundle-assets
[npm-image]: http://img.shields.io/npm/v/gulp-bundle-assets.svg
[travis-image]: https://travis-ci.org/chmontgomery/gulp-bundle-assets.svg?branch=master
[travis-url]: https://travis-ci.org/chmontgomery/gulp-bundle-assets