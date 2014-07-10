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

  function assertStringStartsWithSourceMapJs(str) {
    assert.ok(str.indexOf('//# sourceMappingURL=data:application/json;base64') === 0);
  }

  function assertStringStartsWithSourceMapCss(str) {
    assert.ok(str.indexOf('/*# sourceMappingURL=data:application/json;base64') === 0);
  }

  describe('simple', function () {
    var appPath = path.join(examplePath, 'simple'),
      bundleConfigPath = path.join(appPath, 'bundle.config.js');

    it('should read example bundle.config and create bundles', function (done) {
      gulp.src(bundleConfigPath)
        .pipe(bundler({
          base: appPath,
          dest: testDest
        }))
        .pipe(through.obj(function (file) {

          // verify bundle.results.json
          var resultsJson = JSON.parse(file.contents.toString());
          assert.deepEqual(resultsJson, {
            "main": {
              "css": "<link rel='stylesheet' href='/main-bundle.css' />",
              "js": "<script type='text/javascript' src='/main-bundle.js'></script>"
            }
          });

          // verify individual bundles
          fs.createReadStream(path.join(testDest, 'main-bundle.js'))
            .pipe(through.obj(function (chunk) {
              var lines = chunk.toString().split(/\r?\n/);
              assert.equal(lines[0], 'function logFoo(){console.log("foo")}function logBaz(){console.log("baz")}logFoo(),logBaz();')
              assertStringStartsWithSourceMapJs(lines[1]);
            }))
            .pipe(fs.createReadStream(path.join(testDest, 'main-bundle.css')))
            .pipe(through.obj(function (chunk, enc, cb) {
              var lines = chunk.toString().split(/\r?\n/);
              assertStringStartsWithSourceMapCss(lines[lines.length-1]);
              delete lines[lines.length-1];
              assert.equal(lines.join('\n'), 'body {\n' +
                '  background-color:red;\n' +
                '}\n' +
                '.test {\n' +
                '  background-color: blue;\n' +
                '}\n');
              done();
            }));
        }));
    });
  });

  describe('bower', function () {
    var appPath = path.join(examplePath, 'bower'),
      bundleConfigPath = path.join(appPath, 'bundle.config.js');

    it('should read example bundle.config and create bundles', function (done) {
      gulp.src(bundleConfigPath)
        .pipe(bundler({
          base: appPath,
          dest: testDest
        }))
        .pipe(through.obj(function (file) {

          // verify bundle.results.json
          var resultsJson = JSON.parse(file.contents.toString());
          assert.deepEqual(resultsJson, {
            "main": {
              "css": "<link rel='stylesheet' href='/main-bundle.css' />",
              "js": "<script type='text/javascript' src='/main-bundle.js'></script>"
            },
            "vendor": {
              "css": "<link rel='stylesheet' href='/vendor-bundle.css' />",
              "js": "<script type='text/javascript' src='/vendor-bundle.js'></script>"
            }
          });

          // verify individual bundles
          fs.createReadStream(path.join(testDest, 'main-bundle.js'))
            .pipe(through.obj(function (chunk) {
              var lines = chunk.toString().split(/\r?\n/);
              assert.equal(lines[0], 'console.log("one"),console.log("two");');
              assertStringStartsWithSourceMapJs(lines[1]);
            }))
            .pipe(fs.createReadStream(path.join(testDest, 'main-bundle.css')))
            .pipe(through.obj(function (chunk, enc, cb) {
              var lines = chunk.toString().split(/\r?\n/);
              assertStringStartsWithSourceMapCss(lines[lines.length-1]);
              delete lines[lines.length-1];
              assert.equal(lines.join('\n'),
                  'body {\n' +
                  '  background-color:red;\n' +
                  '}\n' +
                  'body {\n' +
                  '  font-weight: bold;\n' +
                  '}\n');
              done();
            }));
        }));
    });
  });

  describe('express-app-using-result-json', function () {
    var appPath = path.join(examplePath, 'express-app-using-result-json'),
      bundleConfigPath = path.join(appPath, 'bundle.config.js');

    it('should read example bundle.config, create bundles and return results json', function (done) {
      gulp.src(bundleConfigPath)
        .pipe(bundler({
          base: appPath,
          dest: testDest
        }))
        .pipe(through.obj(function (file) {

          // verify bundle.results.json
          var resultsJson = JSON.parse(file.contents.toString());
          assert.deepEqual(resultsJson, {
            "main": {
              "css": "<link rel='stylesheet' href='/main-bundle.css' />",
              "js": "<script type='text/javascript' src='/main-bundle.js'></script>"
            }
          });

          // verify individual bundles
          fs.createReadStream(path.join(testDest, 'main-bundle.js'))
            .pipe(through.obj(function (chunk) {
              var lines = chunk.toString().split(/\r?\n/);
              assert.equal(lines[0], '!function(e){e.parentNode.removeChild(e)}(document.getElementById("error-message")),console.log("foo");');
              assertStringStartsWithSourceMapJs(lines[1]);
            }))
            .pipe(fs.createReadStream(path.join(testDest, 'main-bundle.css')))
            .pipe(through.obj(function (chunk, enc, cb) {
              var lines = chunk.toString().split(/\r?\n/);
              assertStringStartsWithSourceMapCss(lines[lines.length-1]);
              delete lines[lines.length-1];
              assert.equal(lines.join('\n'),
                  '.success-text {\n' +
                  '  color: green;\n' +
                  '}\n');
              done();
            }));
        }));
    });
  });

  afterEach(function (done) {
    rimraf(testDest, function (err) {
      if (err) done(err);
      done();
    });
  });

});
