# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

This release focused on internal refactoring and improving test coverage. Many discoverd bugs have been fixed.

### Fixed
- Potential deadlock in bundles processor.
- Swallowing of exceptions raised within bundler factory and bundler factory streams.
- Virtual path rules in a config not being correctly checked for duplicate matchers.
- Fixed edge case where if the first file in a bundle failed to a resolve a file the resulting exception would never bubble up due to the source stream never being unpaused. #21
- Fixed issue where bundles using both `scripts` and `styles` would result in only files emitted as part of `styles` bundling appearing in the results callback data. #22
- Other undocumented assorted edge cases.

## [3.0.0-rc.1] - 2019-01-09

This release focuses on simplifying the package for UserFrosting 4 to improve maintainability. Features unsupported by UF4 are largely removed.

### Added
- Raw configuration validation.
- Raw configuration merging with collision logic (ported from UserFrosting `gulpfile`).
- Path transformation with support for file replacement based on rule order (later rules superseed earlier ones).
- Ability to specify base path for resolution of bundle resources and path transformations.
- Support for comprehensive logging through a passed logger function.

### Changed
- Functionality offered by results file has been replaced by `ResultsMap` property.
- Reads stream chunks (`Vinyl` instances) instead of directly from file system.
- As an internal `gulp` pipeline is no longer responsible for bundle generation, custom `Transform` streams (e.g. `gulp-concat-css`) must be provided.
- Path transformations will no longer be applied to files due to complexity around how paths are managed in `gulp`. Instead this feature will be used for override logic alone.
- Bundle results are now retrieved via a callback which is given a collection of `Vinyl` `NullFiles` to retain as much useful information as possible.
- Moved package under `@userfrosting` organisation in NPM and removed superfluous `uf` from package name.

### Removed
- Support for CSS sourcemaps (broken since 2.27.2).
- Specification of pre-minified files (`minSrc`).
- CoffeeScript, and LESS compilation (functionality can be implemented manually through provided `Bundlers`).
- Glob paths.
- Environment based build conditions (functionality can be implemented manually through provided `Bundlers`).
- Incremental/watched builds.
- Automatic HTML tag generation for results file (use results callback to implement this manually).
- File copy support (use `gulp.dest` or an equivalent).
- Result file support (replaced by callback).
- Removed dependency on `gulp` as per best practises.

## [2.28.2] - 2018-02-10

### Changed
- Removed some missed references to `gulp-util`.

## [2.28.1] - 2018-02-09

### Changed
- Migrated from deprecated dependency `gulp-util`.

## [2.28.0] - 2017-11-17

### Added
- Merged upstream 2.28.0 release.

### Changed
- Unlocked dependencies to allow backwards compatible feature updates. (`^` vs. `~`).

## [2.27.2] - 2017-02-16

### Changed
- Using `gulp-concat-css` for CSS bundles.

__Project Forked:__ Forked at 2.27.0, 2.28.0 release was backported.

## 2.28.0 - 2017-04-15 (backported)

### Added
- Options to output src files in result [#90](https://github.com/dowjones/gulp-bundle-assets/issues/90) ([@PlasmaPower](https://github.com/PlasmaPower)).

## [2.27.1] - 2016-05-24

_Changes unknown_

## [2.27.0] 2016-05-23

### Added
- Consistent `result.json` ordering [#71](https://github.com/dowjones/gulp-bundle-assets/issues/71) ([@PlasmaPower](https://github.com/PlasmaPower)).

## [2.26.0] - 2016-05-06

### Changed
- Updated many deps including: `gulp-less` 3.1.0, `gulp-coffee` 2.3.2 and `gulp-if` 2.0.1.

## [2.25.0] - 2016-05-06

### Changed
- Update to use `gulp-clean-css` 2.0.7 instead of deprecated `gulp-minify-css` module.

## [2.24.0] - 2016-03-17

### Changed
- Updated to `gulp-less` 3.0.5 and `gulp-uglify` 1.5.3.

## [v.23.0] - 2015-09-16

### Added
- Option to modify built-in sourcemaps [#65](https://github.com/dowjones/gulp-bundle-assets/issues/65) ([@narthollis](https://github.com/narthollis)).

## [2.22.0] - 2015-07-17

### Added
- Config option for consistent file content ordering [#25](https://github.com/dowjones/gulp-bundle-assets/issues/25).

## [2.21.0] - 2015-06-11

### Changed
- Updated all deps, including: `gulp-rev` 4.0.0, `gulp-less` 3.0.3, `gulp-sourcemaps` 1.5.2.

## [2.20.0] - 2015-05-07

### Added
- pluginOptions config option [#50](https://github.com/dowjones/gulp-bundle-assets/issues/50).

## [2.19.2] - 2015-05-07

### Changed
- Update to `gulp-minify-css` 1.1.1 ([@ZaleskiR](https://github.com/ZaleskiR)).

## [2.19.1] - 2015-04-24

### Fixed
- `result.json` url separator on windows [#52](https://github.com/dowjones/gulp-bundle-assets/pull/52) ([@gregorymaertens](https://github.com/gregorymaertens)).

## [2.19.0] - 2015-03-01

### Fixed
- Error handling for `bundle.watch` [#47](https://github.com/dowjones/gulp-bundle-assets/pull/47).

## [2.18.0] - 2015-02-08

### Added
- Flag to disable sourcemaps [#45](https://github.com/dowjones/gulp-bundle-assets/pull/45) ([@21brains-zh](https://github.com/21brains-zh)).

## [2.17.5] - 2015-02-04

### Changed
- Updated examples.

## [2.17.4] - 2015-02-04

### Added
- Logging for errors from custom transforms [#41](https://github.com/dowjones/gulp-bundle-assets/issues/41).

## [2.17.3] - 2015-02-03

### Changed
- Updated examples.

## [2.17.2] - 2015-02-03

### Added
- Logging of bundle config parse errors.

## [2.17.1] - 2014-12-05

### Fixed
- Custom result file name during `bundle.watch` ([@roberto](https://github.com/roberto)).

## [2.17.0] - 2014-12-05

### Added
- Custom result file name [#36](https://github.com/dowjones/gulp-bundle-assets/issues/36) ([@roberto](https://github.com/roberto)).

## [2.16.1] - 2014-12-04

### Fixed
- Unit tests.

## [2.16.0] - 2014-12-01

### Changed
- Updated deps, including: `gulp-rev` 2.0.1, `gulp-sourcemaps` 1.2.8, `gulp-uglify` 1.0.1.

## [2.15.2] - 2014-10-21

### Added
- Support for both minCSS and minCss [#34](https://github.com/dowjones/gulp-bundle-assets/issues/34)

## [2.15.1] - 2014-10-10

### Added
- Example using 6to5 (aka [babel](https://babeljs.io/)).

## [2.15.0] - 2014-09-29

### Added
- `bundle.watch` for copy files [#33](https://github.com/dowjones/gulp-bundle-assets/issues/33).

## [2.14.0] - 2014-09-29

### Added
- Flag to disable logging [#16](https://github.com/dowjones/gulp-bundle-assets/issues/16).

## [2.13.1] - 2014-09-25

### Fixed
- Issue where when bundleAllEnvironments: true, srcMin is always true [#32](https://github.com/dowjones/gulp-bundle-assets/issues/32).

## [2.13.0] - 2014-09-23

### Added
- Allow different watch vs bundle targets [#30](https://github.com/dowjones/gulp-bundle-assets/issues/30).

## [2.12.1] - 2014-09-23

### Fixed
- Only publish results during watch when opts defined.

## [2.12.0] - 2014-09-23

## Added
- `bundle.watch` for bundles [#26](https://github.com/dowjones/gulp-bundle-assets/issues/26).
