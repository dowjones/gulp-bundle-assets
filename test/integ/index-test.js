'use strict';
var path = require('path'),
  examplePath = path.join(__dirname, '/../../examples'),
  assert = require('assert'),
  fs = require('fs'),
  bundler = require('../../index'),
  gulp = require('gulp'),
  through = require('through2'),
  rimraf = require('rimraf'),
  should = require('should');

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
          assertStringStartsWithSourceMapJs(lines[1]);
        } else if (file.relative === 'main.css') {
          lines = file.contents.toString().split(/\r?\n/);
          assertStringStartsWithSourceMapCss(lines[lines.length - 1]);
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
          errorUnexpectedFileInStream(file);
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
          assertStringStartsWithSourceMapJs(lines[1]);
        } else if (file.relative === 'main.css') {
          lines = file.contents.toString().split(/\r?\n/);
          assertStringStartsWithSourceMapCss(lines[lines.length - 1]);
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
          assert.equal(lines[0], 'console.log("jquery"),console.log("angular");');
          assertStringStartsWithSourceMapJs(lines[1]);
        } else if (file.relative === 'vendor.css') {
          lines = file.contents.toString().split(/\r?\n/);
          assertStringStartsWithSourceMapCss(lines[lines.length - 1]);
          delete lines[lines.length - 1];
          assert.equal(lines.join('\n'),
              '.bootstrap {\n' +
              '  background-color: red;\n' +
              '}\n' +
              '.bootstrap-theme {\n' +
              '  background-color: red;\n' +
              '}\n');
        } else if (file.relative === 'bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.eot' ||
          file.relative === 'bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.svg' ||
          file.relative === 'bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.ttf' ||
          file.relative === 'bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.woff') {
          staticFileCount++;
        } else {
          errorUnexpectedFileInStream(file);
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
          assertStringStartsWithSourceMapJs(lines[1]);
        } else if (file.relative === 'main.css') {
          lines = file.contents.toString().split(/\r?\n/);
          assertStringStartsWithSourceMapCss(lines[lines.length - 1]);
          delete lines[lines.length - 1];
          assert.equal(lines.join('\n'), '.success-text {\n' +
            '  color: green;\n' +
            '}\n');
        } else if (file.relative === 'content/images/gulp.png') {
          staticFileCount++;
        } else {
          errorUnexpectedFileInStream(file);
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
              assertStringStartsWithSourceMapJs(lines[1]);
            } else if (file.relative === 'main.css') {
              lines = file.contents.toString().split(/\r?\n/);
              assertStringStartsWithSourceMapCss(lines[lines.length - 1]);
              delete lines[lines.length - 1];
              assert.equal(lines.join('\n'), '.success-text {\n' +
                '  color: green;\n' +
                '}\n');
            } else if (file.relative === 'content/images/gulp.png') {
              staticFileCount++;
            } else {
              errorUnexpectedFileInStream(file);
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
                  "css": "<link rel='stylesheet' href='main.css' />",
                  "js": "<script type='text/javascript' src='main.js'></script>"
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
          errorUnexpectedFileInStream(file);
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

  function errorUnexpectedFileInStream(file) {
    throw new Error('Unexpected file in stream ' + file.relative);
  }

  function assertStringStartsWithSourceMapJs(str) {
    assert.ok(str.indexOf('//# sourceMappingURL=data:application/json;base64') === 0);
  }

  function assertStringStartsWithSourceMapCss(str) {
    assert.ok(str.indexOf('/*# sourceMappingURL=data:application/json;base64') === 0);
  }

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
