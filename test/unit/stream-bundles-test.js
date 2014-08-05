'use strict';
var libPath = './../../lib',
  path = require('path'),
  through = require('through2'),
  mergeStream = require('merge-stream'),
  streamBundles = require(libPath + '/stream-bundles.js'),
  ConfigModel = require(libPath + '/model/config'),
  BundleType = require(libPath + '/model/bundle-type'),
  should = require('should'),
  gutil = require('gulp-util'),
  helpers = require('../helpers');

describe('stream-bundles', function () {

  var fileCount;

  beforeEach(function () {
    fileCount = 0;
  });

  function verifyFileStream(config, done, fn, expectedFileCount, expectedStreamCount) {
    var streams = streamBundles(config);

    (streams.length).should.eql(typeof expectedStreamCount !== 'undefined' ? expectedStreamCount : 1);

    mergeStream.apply(null, streams)
      .pipe(through.obj(function (file, enc, cb) {
        if (fn) fn(file);
        fileCount++;
        this.push(file);
        cb();
      }))
      .on('data', function () {
      }) // noop
      .on('end', function () {
        (fileCount).should.eql(typeof expectedFileCount === 'undefined' ? 1 : expectedFileCount);
        done();
      });

  }

  describe('copy', function () {

    it('should support simple string', function (done) {

      var config = {
        copy: './content/a.js',
        options: {
          base: path.join(__dirname, '../fixtures')
        }
      };

      verifyFileStream(config, done, function (file) {
        file.relative.should.eql('content/a.js');
      });

    });

    describe('object notation', function () {
      it('should support src string', function (done) {

        var config = {
          copy: {
            src: './content/a.js'
          },
          options: {
            base: path.join(__dirname, '../fixtures')
          }
        };

        verifyFileStream(config, done, function (file) {
          file.relative.should.eql('content/a.js');
        });

      });

      it('should support with base', function (done) {

        var config = {
          copy: {
            src: './content/a.js',
            base: './content'
          },
          options: {
            base: path.join(__dirname, '../fixtures')
          }
        };

        verifyFileStream(config, done, function (file) {
          file.relative.should.eql('a.js');
        });

      });
    });

    describe('array notation', function () {
      it('should work with strings', function (done) {

        var config = {
          copy: [
            './content/a.js'
          ],
          options: {
            base: path.join(__dirname, '../fixtures')
          }
        };

        verifyFileStream(config, done, function (file) {
          file.relative.should.eql('content/a.js');
        });

      });

      it('should work with objects', function (done) {

        var config = {
          copy: [
            {
              src: './content/a.js'
            }
          ],
          options: {
            base: path.join(__dirname, '../fixtures')
          }
        };

        verifyFileStream(config, done, function (file) {
          file.relative.should.eql('content/a.js');
        });

      });

      it('should work with objects with base', function (done) {

        var config = {
          copy: [
            {
              src: './content/a.js',
              base: './content'
            }
          ],
          options: {
            base: path.join(__dirname, '../fixtures')
          }
        };

        verifyFileStream(config, done, function (file) {
          file.relative.should.eql('a.js');
        });

      });

      it('should work with objects array src', function (done) {

        var config = {
          copy: [
            {
              src: [
                './content/a.js'
              ]
            }
          ],
          options: {
            base: path.join(__dirname, '../fixtures')
          }
        };

        verifyFileStream(config, done, function (file) {
          file.relative.should.eql('content/a.js');
        });

      });

      it('should work with objects with base and array src', function (done) {

        var config = {
          copy: [
            {
              src: [
                './content/a.js'
              ],
              base: './content'
            }
          ],
          options: {
            base: path.join(__dirname, '../fixtures')
          }
        };

        verifyFileStream(config, done, function (file) {
          file.relative.should.eql('a.js');
        });

      });

    });

    describe('should error', function () {

      it('when copy is num', function () {

        (function () {
          streamBundles({
            copy: 1
          });
        }).should.throw(gutil.PluginError);

      });

      it('when copy is bool', function () {

        (function () {
          streamBundles({
            copy: true
          });
        }).should.throw(gutil.PluginError);

      });

      it('when copy is array and has invalid value: num', function () {

        (function () {
          streamBundles({
            copy: [
              1
            ]
          });
        }).should.throw(gutil.PluginError);

      });

      it('when copy is array and has invalid value: num', function () {

        (function () {
          streamBundles({
            copy: [
              true
            ]
          });
        }).should.throw(gutil.PluginError);

      });

      it('when copy is array and has invalid value: array', function () {

        (function () {
          streamBundles({
            copy: [
              ['./content/*.js']
            ]
          });
        }).should.throw(gutil.PluginError);

      });

    });

  });

  /* jshint -W035 */
  describe('styles', function () {

    it('should support basic less compilation', function (done) {

      var config = {
        bundle: {
          main: {
            styles: 'content/a.less',
            options: {
              rev: false
            }
          }
        },
        options: {
          base: path.join(__dirname, '../fixtures')
        }
      };

      verifyFileStream(config, done, function (file) {
        var fileContents = file.contents.toString();
        if (file.relative === 'main.css') {
          fileContents.should.eql(
              '#header {\n' +
              '  color: #5b83ad;\n' +
              '}\n\n' +
              helpers.getCssSrcMapLine(file.relative));
        } else if (file.relative === 'maps/main.css.map') {
          // ok
        } else {
          helpers.errorUnexpectedFileInStream(file);
        }
      }, 2);

    });

    it('should combine less and css together', function (done) {

      var config = {
        bundle: {
          main: {
            styles: [
              'content/a.css',
              'content/a.less'
            ],
            options: {
              rev: false
            }
          }
        },
        options: {
          base: path.join(__dirname, '../fixtures')
        }
      };

      verifyFileStream(config, done, function (file) {
        var fileContents = file.contents.toString();
        if (file.relative === 'main.css') {
          fileContents.should.eql(
              'body {\n  background-color: red;\n}\n' +
              '#header {\n  color: #5b83ad;\n}\n\n' +
              helpers.getCssSrcMapLine(file.relative));
        } else if (file.relative === 'maps/main.css.map') {
          // ok
        } else {
          helpers.errorUnexpectedFileInStream(file);
        }
      }, 2);

    });

    it('should compile less with @import', function (done) {

      var config = {
        bundle: {
          main: {
            styles: 'content/b.less',
            options: {
              rev: false
            }
          }
        },
        options: {
          base: path.join(__dirname, '../fixtures')
        }
      };

      verifyFileStream(config, done, function (file) {
        var fileContents = file.contents.toString();
        if (file.relative === 'main.css') {
          fileContents.should.eql(
              '.link {\n  color: #428bca;\n}\n\n' +
              helpers.getCssSrcMapLine(file.relative));
        } else if (file.relative === 'maps/main.css.map') {
          // ok
        } else {
          helpers.errorUnexpectedFileInStream(file);
        }
      }, 2);

    });

  });

  describe('scripts', function () {

    it('should not uglify when minSrc defined', function (done) {

      var config = {
        bundle: {
          main: {
            scripts: {
              src: 'content/a.js',
              minSrc: 'content/a.min.js'
            },
            options: {
              rev: false
            }
          }
        },
        options: {
          base: path.join(__dirname, '../fixtures')
        }
      };

      verifyFileStream(config, done, function (file) {
        var fileContents = file.contents.toString();
        if (file.relative === 'main.js') {
          fileContents.should.eql(
              'console.log("a")\n' + // should NOT add ; (which signifies uglifying) b/c minSrc is defined
              helpers.getJsSrcMapLine(file.relative));
        } else if (file.relative === 'maps/main.js.map') {
          // ok
        } else {
          helpers.errorUnexpectedFileInStream(file);
        }
      }, 2);

    });

  });

  describe('NODE_ENV', function () {

    it('should use min src when NODE_ENV=production', function (done) {

      process.env.NODE_ENV = 'production';

      var config = new ConfigModel({
        bundle: {
          main: {
            scripts: { src: 'content/a.js', minSrc: 'content/a.min.js' },
            options: {
              useMin: 'production',
              rev: false
            }
          }
        }
      }, {
        base: path.join(__dirname, '../fixtures')
      });

      verifyFileStream(config, done, function (file) {
        var fileContents = file.contents.toString();
        if (file.relative === 'main.js') {
          fileContents.should.eql(
              'console.log(\"a.min\");\n' +
              helpers.getJsSrcMapLine(file.relative));
        } else if (file.relative === 'maps/main.js.map') {
          // ok
        } else {
          helpers.errorUnexpectedFileInStream(file);
        }
      }, 2, 1);

    });

    it('should create bundles for both environments', function (done) {

      var config = new ConfigModel({
        bundle: {
          main: {
            scripts: { src: 'content/a.js', minSrc: 'content/a.min.js' },
            options: {
              useMin: 'production',
              rev: false
            }
          }
        }
      },{
        base: path.join(__dirname, '../fixtures'),
        bundleAllEnvironments: true
      });

      verifyFileStream(config, done, function (file) {
        var fileContents = file.contents.toString();
        if (file.relative === 'main.js') {
          fileContents.should.eql(
              'console.log(\"a\");\n' +
              helpers.getJsSrcMapLine(file.relative));
        } else if (file.relative === 'main.production.js') {
          fileContents.should.eql(
              'console.log(\"a.min\");\n' +
              helpers.getJsSrcMapLine(file.relative));
        } else if (file.relative === 'maps/main.js.map' ||
          file.relative === 'maps/main.production.js.map') {
          // ok
        } else {
          helpers.errorUnexpectedFileInStream(file);
        }
      }, 4, 2);

    });

    it('should create bundles for multiple environments', function (done) {

      var config = new ConfigModel({
        bundle: {
          main: {
            scripts: { src: 'content/a.js', minSrc: 'content/a.min.js' },
            options: {
              useMin: ['production', 'staging'],
              rev: false
            }
          },
          other: {
            scripts: 'content/a.js',
            options: {
              uglify: 'development',
              rev: false
            }
          }
        }
      }, {
        base: path.join(__dirname, '../fixtures'),
        bundleAllEnvironments: true
      });

      verifyFileStream(config, done, function (file) {
        var fileContents = file.contents.toString();
        if (file.relative === 'main.js') {
          fileContents.should.eql(
              'console.log(\"a\");\n' +
              helpers.getJsSrcMapLine(file.relative));
          file.bundle.should.eql({
            name: 'main',
            type: BundleType.SCRIPTS,
            bundleAllEnvironments: true,
            env: ''
          });
        } else if (file.relative === 'main.production.js') {
          fileContents.should.eql(
              'console.log(\"a.min\");\n' +
              helpers.getJsSrcMapLine(file.relative));
          file.bundle.should.eql({
            name: 'main',
            type: BundleType.SCRIPTS,
            bundleAllEnvironments: true,
            env: 'production'
          });
        } else if (file.relative === 'main.staging.js') {
          fileContents.should.eql(
              'console.log(\"a.min\");\n' +
              helpers.getJsSrcMapLine(file.relative));
          file.bundle.should.eql({
            name: 'main',
            type: BundleType.SCRIPTS,
            bundleAllEnvironments: true,
            env: 'staging'
          });
        } else if (file.relative === 'main.development.js') {
          fileContents.should.eql(
              'console.log(\"a\");\n' +
              helpers.getJsSrcMapLine(file.relative));
          file.bundle.should.eql({
            name: 'main',
            type: BundleType.SCRIPTS,
            bundleAllEnvironments: true,
            env: 'development'
          });
        } else if (file.relative === 'other.js') {
          fileContents.should.eql(
              'console.log(\"a\")\n' +
              helpers.getJsSrcMapLine(file.relative));
          file.bundle.should.eql({
            name: 'other',
            type: BundleType.SCRIPTS,
            bundleAllEnvironments: true,
            env: ''
          });
        } else if (file.relative === 'other.production.js') {
          fileContents.should.eql(
              'console.log(\"a\")\n' +
              helpers.getJsSrcMapLine(file.relative));
          file.bundle.should.eql({
            name: 'other',
            type: BundleType.SCRIPTS,
            bundleAllEnvironments: true,
            env: 'production'
          });
        } else if (file.relative === 'other.staging.js') {
          fileContents.should.eql(
              'console.log(\"a\")\n' + // no ; signifies bundle was properly NOT minified in staging mode
              helpers.getJsSrcMapLine(file.relative));
          file.bundle.should.eql({
            name: 'other',
            type: BundleType.SCRIPTS,
            bundleAllEnvironments: true,
            env: 'staging'
          });
        } else if (file.relative === 'other.development.js') {
          fileContents.should.eql(
              'console.log(\"a\");\n' + // ; signifies bundle was properly minified in dev mode
              helpers.getJsSrcMapLine(file.relative));
          file.bundle.should.eql({
            name: 'other',
            type: BundleType.SCRIPTS,
            bundleAllEnvironments: true,
            env: 'development'
          });
        } else if (file.relative === 'maps/main.js.map' ||
          file.relative === 'maps/main.production.js.map' ||
          file.relative === 'maps/main.staging.js.map' ||
          file.relative === 'maps/main.development.js.map' ||
          file.relative === 'maps/other.js.map' ||
          file.relative === 'maps/other.production.js.map' ||
          file.relative === 'maps/other.staging.js.map' ||
          file.relative === 'maps/other.development.js.map') {
          // ok
        } else {
          helpers.errorUnexpectedFileInStream(file);
        }
      }, 16, 8);

    });

    afterEach(function() {
      process.env.NODE_ENV = '';
    });

  });
  /* jshint +W035 */

});

