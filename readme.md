# [gulp](http://gulpjs.com/)-bundle-assets

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

see `/examples` for more info