# [gulp](https://github.com/gulpjs/gulp)-uf-bundle-assets

| Branch | Status |
| ------ | ------ |
| master | [![Build Status](https://travis-ci.org/userfrosting/gulp-uf-bundle-assets.svg?branch=master)](https://travis-ci.org/userfrosting/gulp-uf-bundle-assets) |
| develop | [![Build Status](https://travis-ci.org/userfrosting/gulp-uf-bundle-assets.svg?branch=develop)](https://travis-ci.org/userfrosting/gulp-uf-bundle-assets) |

Orchastrates JS and CSS bundle creation in a highly efficient and configurable manner.

## Install

```bash
npm install gulp-uf-bundle-assets@alpha --save-dev
```

## Usage

```js
import Bundler from "gulp-uf-bundle-assets";
import Gulp from "gulp";
import CleanCss from "gulp-clean-css";
import ConcatCss from "gulp-concat-css";
import Uglify from "gulp-uglify";
import ConcatJs from "gulp-concat-js";

const config = {
    bundle: {
        example: {
            scripts: [
                "foo.js",
                "bar.js"
            ],
            styles: [
                "foo.css",
                "bar.css"
            ]
        }
    }
};
const joiner = {
    Scripts = function(name) {
        return ConcatJs(name + ".js")
            .pipe(Uglify());
    },
    Styles = function(name) {
        return ConcatCss(name + ".css")
            .pipe(CleanCss({
                compatibility: "ie10"
            }));
    }
};

Gulp.src(inputGlob)
    .pipe(Bundler(config, joiner))
    .pipe(Gulp.dest(outputDir));
```

## Integrating bundles into your app

The `Bundler` class exposes a `ResultsMap` property containing a Map where the key is the bundle name and value the full path of the generated file. If any transform stream after `Bundler` that changes path names then the results map will no longer be accurate, so use the built in path transforms if possible.

This approach was decided on as it provides the most efficient means to integrate bundles with any system. No need to touch the file system until its absolutely necessary, and less work to optimise the output (e.g. make a `php` file out of it to reduce IO in production by maximising use of bytecode caching).

## History

This plugin was originally forked from [gulp-bundle-assets](https://github.com/dowjones/gulp-bundle-assets) to fix a CSS import bug.

It has since been entirely reworked to better suit the requirements of the UserFrosting's Sprinkle system and follow the Gulp plugin guidelines (namely not unncessarily depending on it). Though TypeScript is now the preferred language the output targetted to ES2015 and uses ES Modules (via the `esm` package) to ensure source it can be easily debugged if issues are observed in the wild.

## License

[MIT](LICENSE)
