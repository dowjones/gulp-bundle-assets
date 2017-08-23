# API

## bundle([options])

### options

Type: `Object`

Options to configure bundling.

### options.base

Type: `String`

Default: `.`

Base directory when resolving src globs. Useful when running gulp tasks from a `gulpfile` outside the project's root.

### options.bundleAllEnvironments

Type: `Boolean`

Default: `false`

When `true`, generates all bundles and bundle result jsons for all environments.
This will parse your `bundle.config.js` looking for all environment definitions.
See [this example](../examples/bundle-all-environments) to see the flag in action.

### options.quietMode

Type: `Boolean`

Default: `false`

Flag to disable all console logging.

## bundle.results([options])

Note: beyond this api, bundle results can be further modified with config options like
[custom result types](../examples/custom-result)

The order of the bundles in the results file will be the same as the order in which they were
specified in the config.

### options

Type: `Object` or `String`

If a `String` is passed, it represents the destination of the `bundle.result.json` file, e.g.

```js
gulp.task('bundle', function() {
  return gulp.src('./bundle.config.js')
    .pipe(bundle())
    .pipe(bundle.results('./')) // arg is destination of the result json file
    .pipe(gulp.dest('./public'));
});
```

will place `bundle.result.json` at the project root directory.

### options.dest

Type: `String`

Default: `./`

Same as just passing a `String` to `bundle.results()`. This is the destination of `bundle.result.json`

### options.pathPrefix

Type: `String`

Default: `''`

Appends a string to the beginning of each file path generated in `bundle.result.json`. Example usage:

```js
gulp.task('bundle', function () {
  return gulp.src('./bundle.config.js')
    .pipe(bundle())
    .pipe(bundle.results({
      pathPrefix: '/public/'
    }))
    .pipe(gulp.dest('./public'));
});
```

E.g., if the string was empty you may see a `bundle.result.json` like this:

```js
{
  "main": {
    "styles": "<link href='main.css' media='all' rel='stylesheet' type='text/css'/>",
    "scripts": "<script src='main.js' type='text/javascript'></script>"
  }
}
```

If you set `pathPrefix` to `/public/`, `bundle.result.json` would look like this:

```js
{
  "main": {
    "styles": "<link href='/public/main.css' media='all' rel='stylesheet' type='text/css'/>",
    "scripts": "<script src='/public/main.js' type='text/javascript'></script>"
  }
}
```

### options.fileName

Type: `String`

Default: `bundle.result`

Allows you to change the name of the resulting `bundle.result.json`. E.g.

```js
gulp.task('bundle', function () {
  return gulp.src('./bundle.config.js')
    .pipe(bundle())
    .pipe(bundle.results({
      fileName: 'manifest'
    }))
    .pipe(gulp.dest('./public'));
});
```

Would result in a file named `manifest.json` created at the project root.

### options.outputUnprocessed

Type `Boolean`

Default: `false`

When enabled, output a list of the unprocessed source files in a similar format to the normal result file.
The main difference is that instead of paths, the JSON contains lists of paths making up a single bundle.
The lists of paths are sorted by default, so their order is deterministic. To override this
behaviour see `options.sortUnprocessedOutput`.
See `options.unprocessedOutputFileName` for the name of the resulting file.
This option is used in the result-json example as follows:

Use:

```js
.pipe(bundler.results({
  // irrelevant options omitted
  outputUnprocessed: true,
  unprocessedOutputPathPrefix: '/public/src/'
}))
```

Output:

```js
{
  "customJs": {
    "scripts": [
      "<script src='/public/src/content/js/custom.js' type='text/javascript'></script>"
    ]
  },
  "main": {
    "styles": [
      "<link href='/public/src/content/styles/main.css' media='all' rel='stylesheet' type='text/css'/>"
    ],
    "scripts": [
      "<script src='/public/src/content/js/baz.js' type='text/javascript'></script>",
      "<script src='/public/src/content/js/foo.js' type='text/javascript'></script>"
    ]
  },
  "vendor": {
    "scripts": [
      "<script src='/public/src/bower_components/angular/angular.js' type='text/javascript'></script>",
      "<script src='/public/src/bower_components/jquery/dist/jquery.js' type='text/javascript'></script>"
    ],
    "styles": [
      "<link href='/public/src/bower_components/bootstrap/dist/css/bootstrap-theme.css' media='all' rel='stylesheet' type='text/css'/>",
      "<link href='/public/src/bower_components/bootstrap/dist/css/bootstrap.css' media='all' rel='stylesheet' type='text/css'/>"
    ]
  }
}
```

### options.unprocessedOutputFileName

Type: `String`

Default: `'bundle.source'`

The name of the bundle result for the unprocessed source files.
See `options.fileName` for more details, most notably, the env and `.json` will be appended to the name.

### options.unprocessedOutputPathPrefix

Type `String`

Default: `options.pathPrefix`

Like `options.pathPrefix`, but applies to the unprocessed file result.

### options.sortUnprocessedOutput

Type `Boolean`

Default: `true`

When `true`, will sort unprocessed output in alphanumeric order, otherwise will be in source
input as specified in the bundle config.
