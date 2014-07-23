'use strict';
var path = require('path'),
  examplePath = path.join(__dirname, '/../../examples'),
  assert = require('assert'),
  fs = require('fs'),
  bundler = require('../../index'),
  gulp = require('gulp'),
  through = require('through2'),
  rimraf = require('rimraf'),
  should = require('should'),
  helpers = require('../helpers');

describe('integration tests', function () {

  var fileCount,
    staticFileCount;

  beforeEach(function () {
    fileCount = 0;
    staticFileCount = 0;
  });

  describe('simple', function () {
    var appPath = path.join(examplePath, 'simple'),
      bundleConfigPath = path.join(appPath, 'bundle.config.js');

    it('should read example bundle.config and create bundles', function (done) {

      testBundleStream(bundleConfigPath, appPath, done, function (file) {
        var lines;

        if (file.relative === 'main.js') {
          lines = file.contents.toString().split(/\r?\n/);
          assert.equal(lines[0], 'function logFoo(){console.log("foo")}function logBaz(){console.log("baz")}logFoo(),logBaz();');
          helpers.assertStringStartsWithSourceMapJs(lines[1]);
        } else if (file.relative === 'main.css') {
          lines = file.contents.toString().split(/\r?\n/);
          helpers.assertStringStartsWithSourceMapCss(lines[lines.length - 1]);
          delete lines[lines.length - 1];
          assert.equal(lines.join('\n'), 'body {\n' +
            '  background-color:red;\n' +
            '}\n' +
            '.test {\n' +
            '  background-color: blue;\n' +
            '}\n');
        } else if (file.relative === 'content/images/logo.png' ||
          file.relative === 'content/fonts/awesome.svg') {
          staticFileCount++;
        } else {
          helpers.errorUnexpectedFileInStream(file);
        }
        fileCount++;

      }, function () {
        (fileCount).should.eql(4);
        (staticFileCount).should.eql(2);
      });

    });
  });

  describe('bower', function () {
    var appPath = path.join(examplePath, 'bower'),
      bundleConfigPath = path.join(appPath, 'bundle.config.js');

    it('should read example bundle.config and create bundles', function (done) {

      testBundleStream(bundleConfigPath, appPath, done, function (file) {
        var lines;

        if (file.relative === 'main.js') {
          lines = file.contents.toString().split(/\r?\n/);
          assert.equal(lines[0], 'console.log("one"),console.log("two");');
          helpers.assertStringStartsWithSourceMapJs(lines[1]);
        } else if (file.relative === 'main.css') {
          lines = file.contents.toString().split(/\r?\n/);
          helpers.assertStringStartsWithSourceMapCss(lines[lines.length - 1]);
          delete lines[lines.length - 1];
          assert.equal(lines.join('\n'),
              'body {\n' +
              '  background-color:red;\n' +
              '}\n' +
              'body {\n' +
              '  font-weight: bold;\n' +
              '}\n');
        } else if (file.relative === 'vendor.js') {
          lines = file.contents.toString().split(/\r?\n/);
          helpers.assertStringStartsWithSourceMapJs(lines[lines.length - 1]);
          delete lines[lines.length - 1];
          assert.equal(lines.join('\n'), 'console.log("jquery.min");\nconsole.log("angular.min");\n');
        } else if (file.relative === 'vendor.css') {
          lines = file.contents.toString().split(/\r?\n/);
          helpers.assertStringStartsWithSourceMapCss(lines[lines.length - 1]);
          delete lines[lines.length - 1];
          assert.equal(lines.join('\n'),
              '.bootstrap {\n' +
              '  background-color: red;\n' +
              '}\n' +
              '.bootstrap-theme {\n' +
              '  background-color: red;\n' +
              '}\n');
        } else if (file.relative === 'dist/fonts/glyphicons-halflings-regular.eot' ||
          file.relative === 'dist/fonts/glyphicons-halflings-regular.svg' ||
          file.relative === 'dist/fonts/glyphicons-halflings-regular.ttf' ||
          file.relative === 'dist/fonts/glyphicons-halflings-regular.woff') {
          staticFileCount++;
        } else {
          helpers.errorUnexpectedFileInStream(file);
        }
        fileCount++;

      }, function () {
        (fileCount).should.eql(8);
        (staticFileCount).should.eql(4);
      });

    });
  });

  describe('express-app-using-result-json', function () {
    var appPath = path.join(examplePath, 'express-app-using-result-json'),
      bundleConfigPath = path.join(appPath, 'bundle.config.js');

    it('should read example bundle.config and create bundles', function (done) {

      testBundleStream(bundleConfigPath, appPath, done, function (file) {
        var lines;

        if (file.relative === 'main.js') {
          lines = file.contents.toString().split(/\r?\n/);
          assert.equal(lines[0], '!function(e){e.parentNode.removeChild(e)}(document.getElementById("error-message")),console.log("foo");');
          helpers.assertStringStartsWithSourceMapJs(lines[1]);
        } else if (file.relative === 'main.css') {
          lines = file.contents.toString().split(/\r?\n/);
          helpers.assertStringStartsWithSourceMapCss(lines[lines.length - 1]);
          delete lines[lines.length - 1];
          assert.equal(lines.join('\n'), '.success-text {\n' +
            '  color: green;\n' +
            '}\n');
        } else if (file.relative === 'content/images/gulp.png') {
          staticFileCount++;
        } else {
          helpers.errorUnexpectedFileInStream(file);
        }
        fileCount++;
      }, function () {
        (fileCount).should.eql(3);
        (staticFileCount).should.eql(1);
      });

    });

    describe('result.json', function () {

      var testDest = path.join(__dirname, '.public');

      it('should read example bundle.config, create bundles and create bundle.result.json', function (done) {

        gulp.src(bundleConfigPath)
          .pipe(bundler({
            base: appPath
          }))
          .pipe(bundler.results(testDest))
          .pipe(gulp.dest(testDest))
          .pipe(through.obj(function (file, enc, cb) {

            var lines;

            if (file.relative === 'main.js') {
              lines = file.contents.toString().split(/\r?\n/);
              assert.equal(lines[0], '!function(e){e.parentNode.removeChild(e)}(document.getElementById("error-message")),console.log("foo");');
              helpers.assertStringStartsWithSourceMapJs(lines[1]);
            } else if (file.relative === 'main.css') {
              lines = file.contents.toString().split(/\r?\n/);
              helpers.assertStringStartsWithSourceMapCss(lines[lines.length - 1]);
              delete lines[lines.length - 1];
              assert.equal(lines.join('\n'), '.success-text {\n' +
                '  color: green;\n' +
                '}\n');
            } else if (file.relative === 'content/images/gulp.png') {
              staticFileCount++;
            } else {
              helpers.errorUnexpectedFileInStream(file);
            }
            fileCount++;
            this.push(file);
            cb();
          }))
          .on('data', function () {
          }) // noop
          .on('end', function () {
            fs.readFile(path.join(testDest, 'bundle.result.json'), function (err, data) {
              if (err) {
                throw err;
              }

              var resultsJson = JSON.parse(data);
              assert.deepEqual(resultsJson, {
                "main": {
                  "styles": "<link href='main.css' media='screen' rel='stylesheet' type='text/css'/>",
                  "scripts": "<script src='main.js' type='text/javascript'></script>"
                }
              });

              (fileCount).should.eql(3);
              (staticFileCount).should.eql(1);

              done();
            });
          });

      });

      afterEach(function (done) {
        rimraf(testDest, function (err) {
          if (err) {
            done(err);
          }
          done();
        });
      });

    });

  });

  describe('result-json', function () {
    var appPath = path.join(examplePath, 'result-json'),
      bundleConfigPath = path.join(appPath, 'bundle.config.js'),
      testDest = path.join(__dirname, '.public');

    it('should read bundle.config and create result json', function (done) {

      gulp.src(bundleConfigPath)
        .pipe(bundler({
          base: appPath
        }))
        .pipe(bundler.results(testDest))
        .pipe(gulp.dest(testDest))
        .on('data', function () {
        }) // noop
        .on('end', function () {
          fs.readFile(path.join(testDest, 'bundle.result.json'), function (err, data) {
            if (err) {
              throw err;
            }

            var resultsJson = JSON.parse(data);
            assert.deepEqual(resultsJson, {
              "customJs": {
                "scripts": "<script src='customJs.js' type='text/javascript'></script>"
              },
              "lessBundle": {
                "styles": "<link href='lessBundle.css' media='screen' rel='stylesheet' type='text/css'/>"
              },
              "main": {
                "styles": "<link href='main.css' media='screen' rel='stylesheet' type='text/css'/>",
                "scripts": "<script src='main.js' type='text/javascript'></script>"
              },
              "vendor": {
                "scripts": "<script src='vendor.js' type='text/javascript'></script>",
                "styles": "<link href='vendor.css' media='screen' rel='stylesheet' type='text/css'/>"
              }
            });

            done();
          });
        });

    });

    afterEach(function (done) {
      rimraf(testDest, function (err) {
        if (err) {
          done(err);
        }
        done();
      });
    });

  });


  describe('copy', function () {
    var appPath = path.join(examplePath, 'copy'),
      bundleConfigPath = path.join(appPath, 'bundle.config.js');

    it('should read example bundle.config and copy files', function (done) {

      testBundleStream(bundleConfigPath, appPath, done, function (file) {

        if (file.relative === 'include_path/content/car_icon.png' ||
          file.relative === 'include_path/content/lifering_icon.png' ||
          file.relative === 'content/empire_icon.png' ||
          file.relative === 'content/rebel_icon.png' ||
          file.relative === 'bomb_icon.png' ||
          file.relative === 'content/extinguisher_icon.png') {
          staticFileCount++;
        } else {
          helpers.errorUnexpectedFileInStream(file);
        }
        fileCount++;

      }, function () {
        (fileCount).should.eql(6);
        (staticFileCount).should.eql(6);
      });

    });
  });

  // -----------------------
  // helpers
  // -----------------------

  function testBundleStream(bundleConfigPath, appPath, done, testFunc, beforeEnd) {
    gulp.src(bundleConfigPath)
      .pipe(bundler({
        base: appPath
      }))
      .pipe(through.obj(function (file, enc, cb) {
        testFunc(file);
        this.push(file);
        cb();
      }))
      .on('data', function () {
      }) // noop
      .on('error', function (err) {
        done(err);
      })
      .on('end', function () {
        if (beforeEnd) {
          beforeEnd();
        }
        done();
      });
  }

});
