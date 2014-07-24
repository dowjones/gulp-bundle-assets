'use strict';
var path = require('path'),
  examplePath = path.join(__dirname, '/../../examples'),
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

    it('should read bundle.config and create bundles', function (done) {

      testBundleStream(bundleConfigPath, appPath, done, function (file) {
        var fileContents = file.contents.toString();

        if (file.relative === 'main.js') {
          fileContents.should.eql(
            'function logFoo(){console.log("foo")}function logBaz(){console.log("baz")}logFoo(),logBaz();\n' +
              helpers.getJsSrcMapLine(file.relative));
        } else if (file.relative === 'main.css') {
          fileContents.should.eql(
              'body {\n' +
              '  background-color:red;\n' +
              '}\n' +
              '.test {\n' +
              '  background-color: blue;\n' +
              '}\n' +
              helpers.getCssSrcMapLine(file.relative));
        } else if (file.relative === 'content/images/logo.png' ||
          file.relative === 'content/fonts/awesome.svg' ||
          file.relative === 'maps/main.js.map' ||
          file.relative === 'maps/main.css.map') {
          staticFileCount++;
        } else {
          helpers.errorUnexpectedFileInStream(file);
        }
        fileCount++;

      }, function () {
        (fileCount).should.eql(6);
        (staticFileCount).should.eql(4);
      });

    });
  });

  describe('bower', function () {
    var appPath = path.join(examplePath, 'bower'),
      bundleConfigPath = path.join(appPath, 'bundle.config.js');

    it('should read bundle.config and create bundles', function (done) {

      testBundleStream(bundleConfigPath, appPath, done, function (file) {
        var fileContents = file.contents.toString();

        if (file.relative === 'main.js') {
          fileContents.should.eql(
              'console.log("one"),console.log("two");\n' +
              helpers.getJsSrcMapLine(file.relative));
        } else if (file.relative === 'main.css') {
          fileContents.should.eql(
              'body {\n' +
              '  background-color:red;\n' +
              '}\n' +
              'body {\n' +
              '  font-weight: bold;\n' +
              '}\n' +
              helpers.getCssSrcMapLine(file.relative));
        } else if (file.relative === 'vendor.js') {
          fileContents.should.eql(
              'console.log("jquery.min");\nconsole.log("angular.min");\n' +
              helpers.getJsSrcMapLine(file.relative));
        } else if (file.relative === 'vendor.css') {
          fileContents.should.eql(
              '.bootstrap {\n' +
              '  background-color: red;\n' +
              '}\n' +
              '.bootstrap-theme {\n' +
              '  background-color: red;\n' +
              '}\n' +
              helpers.getCssSrcMapLine(file.relative));
        } else if (file.relative === 'dist/fonts/glyphicons-halflings-regular.eot' ||
          file.relative === 'dist/fonts/glyphicons-halflings-regular.svg' ||
          file.relative === 'dist/fonts/glyphicons-halflings-regular.ttf' ||
          file.relative === 'dist/fonts/glyphicons-halflings-regular.woff' ||
          file.relative === 'maps/vendor.js.map' ||
          file.relative === 'maps/main.js.map' ||
          file.relative === 'maps/main.css.map' ||
          file.relative === 'maps/vendor.css.map') {
          staticFileCount++;
        } else {
          helpers.errorUnexpectedFileInStream(file);
        }
        fileCount++;

      }, function () {
        (fileCount).should.eql(12);
        (staticFileCount).should.eql(8);
      });

    });
  });

  describe('express-app-using-result-json', function () {
    var appPath = path.join(examplePath, 'express-app-using-result-json'),
      bundleConfigPath = path.join(appPath, 'bundle.config.js');

    it('should read bundle.config and create bundles', function (done) {

      testBundleStream(bundleConfigPath, appPath, done, function (file) {
        var fileContents = file.contents.toString();

        if (file.relative === 'main.js') {
          fileContents.should.eql(
              '!function(e){e.parentNode.removeChild(e)}(document.getElementById("error-message")),console.log("foo");\n' +
              helpers.getJsSrcMapLine(file.relative));
        } else if (file.relative === 'main.css') {
          fileContents.should.eql(
              '.success-text {\n' +
              '  color: green;\n' +
              '}\n' +
              helpers.getCssSrcMapLine(file.relative));
        } else if (file.relative === 'content/images/gulp.png' ||
          file.relative === 'maps/main.css.map' ||
          file.relative === 'maps/main.js.map') {
          staticFileCount++;
        } else {
          helpers.errorUnexpectedFileInStream(file);
        }
        fileCount++;
      }, function () {
        (fileCount).should.eql(5);
        (staticFileCount).should.eql(3);
      });

    });

    describe('result.json', function () {

      var testDest = path.join(__dirname, '.public');

      it('should read bundle.config, create bundles and create bundle.result.json', function (done) {

        gulp.src(bundleConfigPath)
          .pipe(bundler({
            base: appPath
          }))
          .pipe(bundler.results(testDest))
          .pipe(gulp.dest(testDest))
          .pipe(through.obj(function (file, enc, cb) {

            var fileContents = file.contents.toString();

            if (file.relative === 'main.js') {
              fileContents.should.eql(
                '!function(e){e.parentNode.removeChild(e)}(document.getElementById("error-message")),console.log("foo");\n' +
                  helpers.getJsSrcMapLine(file.relative));
            } else if (file.relative === 'main.css') {
              fileContents.should.eql(
                  '.success-text {\n' +
                  '  color: green;\n' +
                  '}\n' +
                  helpers.getCssSrcMapLine(file.relative));
            } else if (file.relative === 'content/images/gulp.png' ||
              file.relative === 'maps/main.css.map' ||
              file.relative === 'maps/main.js.map') {
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

              JSON.parse(data).should.eql({
                "main": {
                  "styles": "<link href='main.css' media='screen' rel='stylesheet' type='text/css'/>",
                  "scripts": "<script src='main.js' type='text/javascript'></script>"
                }
              });

              (fileCount).should.eql(5);
              (staticFileCount).should.eql(3);

              done();
            });
          });

      });

      afterEach(function (done) {
        remove(testDest, done);
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

            JSON.parse(data).should.eql({
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
      remove(testDest, done);
    });

  });

  describe('per-environment', function () {
    var appPath = path.join(examplePath, 'per-environment'),
      bundleConfigPath = path.join(appPath, 'bundle.config.js');

    it('should read bundle.config and create bundles with some uglified js, some not', function (done) {

      testBundleStream(bundleConfigPath, appPath, done, function (file) {
        var fileContents = file.contents.toString();

        if (file.relative === 'main.css') { // unminified
          fileContents.should.eql(
              'body {\n' +
              '  background-color:red;\n' +
              '}\n' +
              'body {\n' +
              '  font-weight: bold;\n' +
              '}\n' +
              helpers.getCssSrcMapLine(file.relative));
        } else if (file.relative === 'one.js') { // unminified
          fileContents.should.eql(
              'if (true) {\n' +
              '  console.log("one");\n' +
              '} else {\n' +
              '  console.log("this line should NOT be in uglified output");\n' +
              '}\n' +
              helpers.getJsSrcMapLine(file.relative));
        } else if (file.relative === 'threve.js') { // minified
          fileContents.should.eql(
              'console.log("threve");\n' +
              helpers.getJsSrcMapLine(file.relative));
        } else if (file.relative === 'two.js') { // unminified
          fileContents.should.eql(
              'if (true) {\n' +
              '  console.log("two");\n' +
              '} else {\n' +
              '  console.log("this line should NOT be in uglified output");\n' +
              '}\n' +
              helpers.getJsSrcMapLine(file.relative));
        } else if (file.relative === 'vendor.js') { // unminified
          fileContents.should.eql(
              'if (true) {\n' +
              '  console.log("jquery");\n' +
              '} else {\n' +
              '  console.log("this line should NOT be in uglified output");\n' +
              '}\n' +
              'if (true) {\n' +
              '  console.log("angular");\n' +
              '} else {\n' +
              '  console.log("this line should NOT be in uglified output");\n' +
              '}\n' +
              helpers.getJsSrcMapLine(file.relative));
        } else if (file.relative === 'vendor.css') { // unminified
          fileContents.should.eql(
              '.bootstrap {\n' +
              '  background-color: red;\n' +
              '}\n' +
              helpers.getCssSrcMapLine(file.relative));
        } else if (file.relative === 'maps/vendor.css.map' ||
          file.relative === 'maps/vendor.js.map' ||
          file.relative === 'maps/main.css.map' ||
          file.relative === 'maps/main.js.map' ||
          file.relative === 'maps/one.js.map' ||
          file.relative === 'maps/two.js.map' ||
          file.relative === 'maps/threve.js.map') {
          staticFileCount++;
        } else {
          helpers.errorUnexpectedFileInStream(file);
        }
        fileCount++;

      }, function () {
        (fileCount).should.eql(12);
        (staticFileCount).should.eql(6);
      });

    });
  });


  describe('copy', function () {
    var appPath = path.join(examplePath, 'copy'),
      bundleConfigPath = path.join(appPath, 'bundle.config.js');

    it('should read bundle.config and copy files', function (done) {

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

  function remove(path, done) {
    fs.exists(path, function (exists) {
      if (exists) {
        rimraf(path, function (err) {
          if (err) {
            done(err);
          }
          done();
        });
      } else {
        done();
      }
    });
  }

});
