# custom-transforms

This example shows how to use `gulp-bundle-assets` in conjunction with many custom gulp plugins.
These transforms are run at the beginning of the bundle phase, before the files are minified and combined.

NOTE: any plugin you wish to use should support [sourcemaps](https://github.com/floridoo/gulp-sourcemaps),
otherwise it will break the resulting sourcemaps generation. 
See [here on how to add this support to a gulp plugin](https://github.com/floridoo/gulp-sourcemaps#plugin-developers-only-how-to-add-source-map-support-to-plugins).

## How to define custom transforms

Define your custom transforms as part of a `[lazypipe](https://github.com/OverZealous/lazypipe)` stream.
If you define them within a normal pipe they won't work.

```js
// bundle.config.js
var coffee = require('gulp-coffee');
var lazypipe = require('lazypipe');
var sass = require('gulp-sass');
var less = require('gulp-less');
var gif = require('gulp-if');

function stringEndsWith(str, suffix) {
  return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

// only run transforms against certain file types.
// This is only necessary if your bundle has a mix of file types in it
function isScssFile(file) {
  return stringEndsWith(file.relative, 'scss');
}

function isLessFile(file) {
  return stringEndsWith(file.relative, 'less');
}

var scriptTransforms = lazypipe()
  .pipe(coffee);

// pipe as many transforms together as you like
var styleTransforms = lazypipe()
  .pipe(function() {
    // when using lazy pipe you need to call gulp-if from within an anonymous func
    // https://github.com/robrich/gulp-if#works-great-inside-lazypipe
    return gif(isScssFile, sass());
  })
  .pipe(function() {
    return gif(isLessFile, less());
  });
```

## How to use custom transforms

Each bundle supports a `options.transforms` object which accepts custom transforms for scripts and styles.

```js
// bundle.config.js
module.exports = {
  bundle: {
    article: {
      scripts: ...,
      styles: ...,
      options: {
        transforms: {
          scripts: scriptTransforms, // pipe(s) of script transforms
          styles: styleTransforms // pipe(s) of style transforms
        }
      }
    }
  }
};
```

## After transforms

If you wish to transform your resulting files further after the bundling process is complete, simply pipe on
transforms to the end of the gulp pipe:

```js
// gulpfile.js
gulp.task('bundle', function () {
  return gulp.src('./bundle.config.js')
    .pipe(bundle())
    .pipe(moreCustomTransforms())
    .pipe(gulp.dest('./public'));
});
```