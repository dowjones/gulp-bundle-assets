'use strict';
var path = require('path'),
  examplePath = path.join(__dirname, '/../../examples'),
  assert = require('assert'),
  fs = require('fs'),
  bundler = require('../../index'),
  gulp = require('gulp'),
  through = require('through2'),
  rimraf = require('rimraf');

describe('integration tests', function () {

  var testDest = path.join(__dirname, '.public');

  describe('simple', function () {
    var appPath = path.join(examplePath, 'simple'),
      bundleConfigPath = path.join(appPath, 'bundle.config.js');

    it('should read example bundle.config and create bundles', function (done) {

      testBundleStream(bundleConfigPath, appPath, done, function (file, enc, cb) {
        var lines;

        if (file.relative === 'main.js') {
          lines = file.contents.toString().split(/\r?\n/);
          assert.equal(lines[0], 'function logFoo(){console.log("foo")}function logBaz(){console.log("baz")}logFoo(),logBaz();')
          assertStringStartsWithSourceMapJs(lines[1]);
        } else if (file.relative === 'main.css') {
          lines = file.contents.toString().split(/\r?\n/);
          assertStringStartsWithSourceMapCss(lines[lines.length-1]);
          delete lines[lines.length-1];
          assert.equal(lines.join('\n'), 'body {\n' +
            '  background-color:red;\n' +
            '}\n' +
            '.test {\n' +
            '  background-color: blue;\n' +
            '}\n');
        } else {
          errorUnexpectedFileInStream(file);
        }
      });

    });
  });

  describe('bower', function () {
    var appPath = path.join(examplePath, 'bower'),
      bundleConfigPath = path.join(appPath, 'bundle.config.js');

    it('should read example bundle.config and create bundles', function (done) {

      testBundleStream(bundleConfigPath, appPath, done, function (file, enc, cb) {
        var lines;

        if (file.relative === 'main.js') {
          lines = file.contents.toString().split(/\r?\n/);
          assert.equal(lines[0], 'console.log("one"),console.log("two");');
          assertStringStartsWithSourceMapJs(lines[1]);
        } else if (file.relative === 'main.css') {
          lines = file.contents.toString().split(/\r?\n/);
          assertStringStartsWithSourceMapCss(lines[lines.length-1]);
          delete lines[lines.length-1];
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
          assertStringStartsWithSourceMapCss(lines[lines.length-1]);
          delete lines[lines.length-1];
          assert.equal(lines.join('\n'),
              '.bootstrap {\n' +
              '  background-color: red;\n' +
              '}\n' +
              '.bootstrap-theme {\n' +
              '  background-color: red;\n' +
              '}\n');
        } else {
          errorUnexpectedFileInStream(file);
        }
      });

    });
  });

  describe('express-app-using-result-json', function () {
    var appPath = path.join(examplePath, 'express-app-using-result-json'),
      bundleConfigPath = path.join(appPath, 'bundle.config.js');

    it('should read example bundle.config, create bundles and return results json', function (done) {

      testBundleStream(bundleConfigPath, appPath, done, function (file, enc, cb) {
        var lines;

        if (file.relative === 'main.js') {
          lines = file.contents.toString().split(/\r?\n/);
          assert.equal(lines[0], '!function(e){e.parentNode.removeChild(e)}(document.getElementById("error-message")),console.log("foo");');
          assertStringStartsWithSourceMapJs(lines[1]);
        } else if (file.relative === 'main.css') {
          lines = file.contents.toString().split(/\r?\n/);
          assertStringStartsWithSourceMapCss(lines[lines.length-1]);
          delete lines[lines.length-1];
          assert.equal(lines.join('\n'), '.success-text {\n' +
            '  color: green;\n' +
            '}\n');
        } else {
          errorUnexpectedFileInStream(file);
        }
      });

    });
  });

  afterEach(function (done) {
    rimraf(testDest, function (err) {
      if (err) done(err);
      done();
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

  function testBundleStream(bundleConfigPath, appPath, done, testFunc) {
    gulp.src(bundleConfigPath)
      .pipe(bundler({
        base: appPath
      }))
      .pipe(gulp.dest(testDest))
      .pipe(through.obj(function(file, enc, cb) {
        testFunc(file, enc, cb);
        this.push(file);
        cb();
      }))
      .on('data', function() {
        // noop
      })
      .on('end', function() {
        done()
      });
  }

});
