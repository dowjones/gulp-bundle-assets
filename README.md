# [gulp](https://github.com/gulpjs/gulp)-uf-bundle-assets

| Branch | Status |
| ------ | ------ |
| master | [![Build Status](https://travis-ci.org/userfrosting/gulp-uf-bundle-assets.svg?branch=master)](https://travis-ci.org/userfrosting/gulp-uf-bundle-assets) |
| develop | [![Build Status](https://travis-ci.org/userfrosting/gulp-uf-bundle-assets.svg?branch=develop)](https://travis-ci.org/userfrosting/gulp-uf-bundle-assets) |

Orchastrates JS and CSS bundle creation in a highly efficient and configurable manner.

## Install

```bash
$ npm install gulp-uf-bundle-assets --save-dev
```

## Usage

```js
import Bundler from "gulp-uf-bundle-assets";
import Gulp from "gulp";

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
        // TODO
    },
    Styles = function(name) {
        // TODO
    }
};

Gulp.src(inputGlob)
    .pipe(Bundler(config, joiner))
    .pipe(Gulp.dest(outputDir));
```

## Integrating bundles into your app


## History

This plugin was originally forked from [gulp-bundle-assets](https://github.com/dowjones/gulp-bundle-assets) to fix a CSS import bug.

It has since been entirely reworked to better suit the requirements of the UserFrosting's Sprinkle system and follow the Gulp plugin guidelines (namely not unncessarily depending on it). Though TypeScript is now the preferred language the output targetted to ES2015 and uses ES Modules (via the `esm` package) to ensure source it can be easily debugged if issues are observed in the wild.

## License

[MIT](LICENSE)
