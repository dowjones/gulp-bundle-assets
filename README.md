# [gulp](https://github.com/gulpjs/gulp)-bundle-assets

| Branch | Status |
| ------ | ------ |
| master | [![Build Status](https://travis-ci.org/userfrosting/gulp-uf-bundle-assets.svg?branch=master)](https://travis-ci.org/userfrosting/gulp-uf-bundle-assets) [![codecov](https://codecov.io/gh/userfrosting/gulp-uf-bundle-assets/branch/master/graph/badge.svg)](https://codecov.io/gh/userfrosting/gulp-uf-bundle-assets/branch/master) |
| develop | [![Build Status](https://travis-ci.org/userfrosting/gulp-uf-bundle-assets.svg?branch=develop)](https://travis-ci.org/userfrosting/gulp-uf-bundle-assets) [![codecov](https://codecov.io/gh/userfrosting/gulp-uf-bundle-assets/branch/develop/graph/badge.svg)](https://codecov.io/gh/userfrosting/gulp-uf-bundle-assets/branch/develop) |

Orchastrates JS and CSS bundle creation in a highly efficient and configurable manner.

**CAUTION** The implementation currently produces a great deal backpressure. This can result in signficiant RAM usage. Projects dealing with a significant number resources are better off not using this tool until the custom stream source is implemented in v4.

## Install

```bash
npm install @userfrosting/gulp-bundle-assets --save-dev
```

## Usage

```js
// gulpfile.esm.js
import assetBundler from "@userfrosting/gulp-bundle-assets";
import { src, dest } from "gulp";
import cleanCss from "gulp-clean-css";
import concatCss from "gulp-concat-css";
import uglify from "gulp-uglify";
import concatJs from "gulp-concat-js";

export function bundle() {
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
        Scripts = function(bundleStream, name) {
            return bundleStream
                .pipe(concatJs(name + ".js"))// example.js
                .pipe(uglify());
        },
        Styles = function(bundleStream, name) {
            return bundleStream
                .pipe(concatCss(name + ".css"))// example.css
                .pipe(cleanCss({
                    compatibility: "ie10"
                }));
        }
    };

    return src("src/**")
        .pipe(assetBundler(config, joiner))
        .pipe(dest("public/assets/"));
}
```

```bash
$ gulp bundle
```

## Integrating bundles into your app

The `Bundler` class exposes a `ResultsMap` property containing a Map where the key is the bundle name and value the full path of the generated file. If any transform stream after `Bundler` that changes path names then the results map will no longer be accurate, so use the built in path transforms if possible.

This approach was decided on as it provides the most efficient means to integrate bundles with any system. No need to touch the file system until its absolutely necessary, and less work to optimise the output (e.g. make a `php` file out of it to reduce IO in production by maximising use of bytecode caching).

## API

Generation of API documentation is not yet implemented however the API surface is fully documented interally. Use VS Code or look at the source on GitHub in the meantime.

## History

This plugin was originally forked from [gulp-bundle-assets](https://github.com/dowjones/gulp-bundle-assets) to fix a CSS import bug.

It has since been entirely reworked to better suit the requirements of the UserFrosting's Sprinkle system and follow the Gulp plugin guidelines (namely not unncessarily depending on it). Though TypeScript is now the preferred language the output targetted to ES2015 and uses ES Modules (via the `esm` package) to ensure source it can be easily debugged if issues are observed in the wild.

This package was previously published under `gulp-uf-bundle-assets` and as of v3 is published under `@userfrosting/gulp-bundle-assets` to assist in longterm project management.

## Release process

Generally speaking, all releases should first traverse through `alpha`, `beta`, and `rc` (release candidate) to catch missed bugs and gather feedback as appropriate. Aside from this however, there are a few steps that **MUST** always be done.

1. Make sure [`CHANGELOG.md`](./CHANGELOG.md) is up to date.
2. Update version via `npm` like `npm version 3.0.0` or `npm version patch`.
3. `npm publish`.
4. Create release on GitHub from tag made by `npm version`.

## License

[MIT](LICENSE)
