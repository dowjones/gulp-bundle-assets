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
    staticFileCount,
    testDest = path.join(__dirname, '../fixtures/.public');

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
              'function logFoo(){console.log(\"foo\")}logFoo();\nfunction logBaz(){console.log(\"baz\")}logBaz();\n' +
              helpers.getJsSrcMapLine(file.relative));
        } else if (file.relative === 'main.css') {
          fileContents.should.eql(
              'body{background-color:red}\n.test{background-color:#00f}\n' +
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
              'console.log(\"one\");\nconsole.log(\"two\");\n' +
              helpers.getJsSrcMapLine(file.relative));
        } else if (file.relative === 'main.css') {
          fileContents.should.eql(
              'body{background-color:red}\nbody{font-weight:700}\n' +
              helpers.getCssSrcMapLine(file.relative));
        } else if (file.relative === 'vendor.js') {
          fileContents.should.eql(
              'console.log("jquery.min");\nconsole.log("angular.min");\n' +
              helpers.getJsSrcMapLine(file.relative));
        } else if (file.relative === 'vendor.css') {
          fileContents.should.eql(
              '.bootstrap.min {\n  background-color: blue;\n}\n.bootstrap-theme.min {\n  background-color: blue;\n}\n' +
              helpers.getCssSrcMapLine(file.relative));
        } else if (helpers.stringEndsWith(file.relative, '.map') ||
          file.relative === 'dist/fonts/glyphicons-halflings-regular.eot' ||
          file.relative === 'dist/fonts/glyphicons-halflings-regular.svg' ||
          file.relative === 'dist/fonts/glyphicons-halflings-regular.ttf' ||
          file.relative === 'dist/fonts/glyphicons-halflings-regular.woff') {
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

        if (file.relative === 'main-2742a3c06d.js') {
          fileContents.should.eql(
              '!function(e){e.parentNode.removeChild(e)}(document.getElementById(\"error-message\"));\nconsole.log(\"foo\");\n' +
              helpers.getJsSrcMapLine(file.relative));
        } else if (file.relative === 'main-0cd4ab1aa8.css') {
          fileContents.should.eql(
              '.success-text{color:green}\n' +
              helpers.getCssSrcMapLine(file.relative));
        } else if (file.relative === 'content/images/gulp.png' ||
          helpers.stringEndsWith(file.relative, '.map')) {
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

      it('should read bundle.config, create bundles and create bundle.result.json', function (done) {

        gulp.src(bundleConfigPath)
          .pipe(bundler({
            base: appPath
          }))
          .pipe(bundler.results(testDest))
          .pipe(gulp.dest(testDest))
          .pipe(through.obj(function (file, enc, cb) {

            var fileContents = file.contents.toString();

            if (file.relative === 'main-2742a3c06d.js') {
              fileContents.should.eql(
                  '!function(e){e.parentNode.removeChild(e)}(document.getElementById(\"error-message\"));\nconsole.log(\"foo\");\n' +
                  helpers.getJsSrcMapLine(file.relative));
            } else if (file.relative === 'main-0cd4ab1aa8.css') {
              fileContents.should.eql(
                  '.success-text{color:green}\n' +
                  helpers.getCssSrcMapLine(file.relative));
            } else if (file.relative === 'content/images/gulp.png' ||
              helpers.stringEndsWith(file.relative, '.map')) {
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
                return done(err);
              }

              JSON.parse(data).should.eql({
                "main": {
                  "styles": "<link href='main-0cd4ab1aa8.css' media='all' rel='stylesheet' type='text/css'/>",
                  "scripts": "<script src='main-2742a3c06d.js' type='text/javascript'></script>"
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
      bundleConfigPath = path.join(appPath, 'bundle.config.js');

    it('should read bundle.config and create result json', function (done) {

      gulp.src(bundleConfigPath)
        .pipe(bundler({
          base: appPath
        }))
        .pipe(bundler.results({
          dest: testDest,
          pathPrefix: '/public/'
        }))
        .pipe(gulp.dest(testDest))
        .on('data', function () {
        }) // noop
        .on('end', function () {
          fs.readFile(path.join(testDest, 'bundle.result.json'), function (err, data) {
            if (err) {
              return done(err);
            }

            JSON.parse(data).should.eql({
              "customJs": {
                "scripts": "<script src='/public/customJs-33c43745c3.js' type='text/javascript'></script>"
              },
              "main": {
                "styles": "<link href='/public/main-0cd4ab1aa8.css' media='all' rel='stylesheet' type='text/css'/>",
                "scripts": "<script src='/public/main-2742a3c06d.js' type='text/javascript'></script>"
              },
              "vendor": {
                "scripts": "<script src='/public/vendor-6873f46ec1.js' type='text/javascript'></script>",
                "styles": "<link href='/public/vendor-7c38ff6718.css' media='all' rel='stylesheet' type='text/css'/>"
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

  describe('bundle-all-environments', function () {
    var appPath = path.join(examplePath, 'bundle-all-environments'),
      bundleConfigPath = path.join(appPath, 'bundle.config.js');

    it('should read bundle.config and create bundles', function (done) {

      testBundleStream(bundleConfigPath, appPath, done, function (file) {
        var fileContents = file.contents.toString();

        /* jshint -W035 */
        if (file.relative === 'main.js') {
          fileContents.should.eql(
              "(function(x){x.parentNode.removeChild(x);})(document.getElementById('error-message'));\nconsole.log('foo')\n" +
              helpers.getJsSrcMapLine(file.relative));
        } else if (file.relative === 'main.css' ||
          file.relative === 'main.production-0cd4ab1aa8.css' ||
          file.relative === 'main.production-2742a3c06d.js' ||
          file.relative === 'main.staging-0cd4ab1aa8.css' ||
          file.relative === 'main.staging-2742a3c06d.js' ||
          file.relative === 'vendor.css' ||
          file.relative === 'vendor.production-bfff342870.css' ||
          file.relative === 'vendor.production-fc7efeba4f.js' ||
          file.relative === 'vendor.staging-bfff342870.css' ||
          file.relative === 'vendor.staging-fc7efeba4f.js') {
          //ok
        } else if (file.relative === 'vendor.js') {
          fileContents.should.eql(
              'console.log("angular");\nconsole.log("spin")\n' +
              helpers.getJsSrcMapLine(file.relative));
        } else if (file.relative === 'vendor.production-fc7efeba.js') {
          fileContents.should.eql(
              'console.log("angular.min");\nconsole.log("spin")\n' +
              helpers.getJsSrcMapLine(file.relative));
        } else if (helpers.stringEndsWith(file.relative, '.map')) {
          staticFileCount++;
        } else {
          helpers.errorUnexpectedFileInStream(file);
        }
        /* jshint +W035 */
        fileCount++;

      }, function () {
        (fileCount).should.eql(24);
        (staticFileCount).should.eql(12);
      }, true);

    });
  });


  describe('per-environment', function () {
    var appPath = path.join(examplePath, 'per-environment'),
      bundleConfigPath = path.join(appPath, 'bundle.config.js');

    it('should read bundle.config and create bundles with some uglified js, some not', function (done) {

      testBundleStream(bundleConfigPath, appPath, done, function (file) {
        var fileContents = file.contents.toString();

        if (file.relative === 'main-b7f160212c.css') { // minified
          fileContents.should.eql(
              'body{background-color:red}\nbody{font-weight:700}\n' +
              helpers.getCssSrcMapLine(file.relative));
        } else if (file.relative === 'one.js') { // unminified
          fileContents.should.eql(
              'if (true) {\n' +
              '  console.log("one");\n' +
              '} else {\n' +
              '  console.log("this line should NOT be in uglified output");\n' +
              '}\n' +
              helpers.getJsSrcMapLine(file.relative));
        } else if (file.relative === 'threeve-40307fcc10.js') { // minified
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
        } else if (helpers.stringEndsWith(file.relative, '.map')) {
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

  describe('full', function () {
    var appPath = path.join(examplePath, 'full'),
      bundleConfigPath = path.join(appPath, 'bundle.config.js'),
      HEADER_SCRIPT_CONTENT_NOT_UGLIFIED = 'console.log(\"header-scripts\")\nconsole.log(\"line-two\")\n',
      HEADER_SCRIPT_CONTENT_UGLIFIED = 'console.log(\"header-scripts\"),console.log(\"line-two\");\n',
      HEADER_CSS_CONTENT_MINIFIED = '.header{color:#000}\n.bootstrap.min {\n  background-color: blue;\n}\n',
      HEADER_CSS_CONTENT_NOT_MINIFIED = '.header {\n  color: black;\n}\n.bootstrap {\n  background-color: red;\n}\n',
      JQUERY_CONTENT_NOT_UGLIFIED = 'console.log(\"jquery\")\n',
      JQUERY_CONTENT_MIN_NOT_UGLIFIED_NO_MAPS = 'console.log(\"jquery.min\")',
      JQUERY_CONTENT_MIN_NOT_UGLIFIED = JQUERY_CONTENT_MIN_NOT_UGLIFIED_NO_MAPS + '\n',
      VENDOR_CONTENT_NOT_UGLIFIED = 'console.log(\"angular\")\nconsole.log(\"spin\")\n',
      VENDOR_CONTENT_MIN_NOT_UGLIFIED = 'console.log(\"angular.min\")\nconsole.log(\"spin\")\n',
      VENDOR_CSS_CONTENT_MIN_MINIFIED = '.angular-csp-min {\n  font-weight: bold;\n}\n',
      VENDOR_CSS_CONTENT_NOT_MINIFIED = '.angular-csp {\n  font-weight: bold;\n}\n',
      ARTICLE_CONTENT_NOT_UGLIFIED = 'console.log(\"page\")\nconsole.log(\"scroll\")\n(function() {\n  var number, square;\n\n  number = 42;\n\n  square = function(x) {\n    return x * x;\n  };\n\n}).call(this);\n\n',
      ARTICLE_CONTENT_UGLIFIED = 'console.log(\"page\");\nconsole.log(\"scroll\");\n(function(){var number,square;number=42,square=function(x){return x*x}}).call(this);\n',
      ARTICLE_CSS_CONTENT_MINIFIED = '.page{background-color:red}\n',
      ARTICLE_CSS_CONTENT_NOT_MINIFIED = '.other-sass {\n  background-color: darkred; }\n\n.page {\n  background-color: red;\n}\n\n',
      MAIN_CONTENT_NOT_UGLIFIED = 'console.log(\"app\")\nconsole.log(\"controllers\")\nconsole.log(\"directives\")\nconsole.log(\"filters\")\n',
      MAIN_CONTENT_UGLIFIED = 'console.log(\"app\");\nconsole.log(\"controllers\");\nconsole.log(\"directives\");\nconsole.log(\"filters\");\n',
      MAIN_CSS_CONTENT_MINIFIED = '.legacy{background-color:green}\nbody{background-color:#00f}\n',
      MAIN_CSS_CONTENT_NOT_MINIFIED = '.legacy {\n  background-color: green;\n}\nbody {\n  background-color: blue;\n}\n\n',
      ORDERED_BUNDLE_CONTENT = 'console.log("first");\nconsole.log("jquery.min");\nconsole.log("lodash");\n(function(){var f;f="file1.coffee"}).call(this);\n(function(){var f;f="file2.coffee"}).call(this);\nconsole.log("something in the middle");\nconsole.log("last");\n',
      ORDERED_BUNDLE_CSS_CONTENT = '.always-first{background-color:red}\n.bootstrap-min {background-color: coral;}\n.vendor{background-color:wheat}\n.file1-less{background-color:purple}\n.file2-less{background-color:#ff0}\n.something-in-the-middle{background-color:#00f}\n.always-last{background-color:green}\n';

    it('should read bundle.config and create bundles in prod mode', function (done) {

      process.env.NODE_ENV = 'production';

      testBundleStream(bundleConfigPath, appPath, done, function (file) {
        var fileContents = file.contents.toString();

        if (file.relative === 'header-c380f8735f.js') {
          fileContents.should.eql(
              HEADER_SCRIPT_CONTENT_UGLIFIED +
              JQUERY_CONTENT_MIN_NOT_UGLIFIED +
              helpers.getJsSrcMapLine(file.relative));
        } else if (file.relative === 'header-450a885fe9.css') {
          fileContents.should.eql(
              HEADER_CSS_CONTENT_MINIFIED +
              helpers.getCssSrcMapLine(file.relative));
        } else if (file.relative === 'vendor-b9c14db406.js') {
          fileContents.should.eql(
              VENDOR_CONTENT_MIN_NOT_UGLIFIED +
              helpers.getJsSrcMapLine(file.relative));
        } else if (file.relative === 'vendor-752c24d067.css') {
          fileContents.should.eql(
              VENDOR_CSS_CONTENT_MIN_MINIFIED +
              helpers.getCssSrcMapLine(file.relative));
        } else if (file.relative === 'article-19f4f97809.js') {
          fileContents.should.eql(
              ARTICLE_CONTENT_UGLIFIED +
              helpers.getJsSrcMapLine(file.relative));
        } else if (file.relative === 'article-eb84c68ed8.css') {
          fileContents.should.eql(
              ARTICLE_CSS_CONTENT_MINIFIED +
              helpers.getCssSrcMapLine(file.relative));
        } else if (file.relative === 'main-56c9e7f7a2.css') {
          fileContents.should.eql(
              MAIN_CSS_CONTENT_MINIFIED +
              helpers.getCssSrcMapLine(file.relative));
        } else if (file.relative === 'main-a2f0720d62.js') {
          fileContents.should.eql(
              MAIN_CONTENT_UGLIFIED +
              helpers.getJsSrcMapLine(file.relative));
        } else if (file.relative === 'jquery-stand-alone-29f6b03537.js') {
          fileContents.should.eql(JQUERY_CONTENT_MIN_NOT_UGLIFIED_NO_MAPS); // no sourcemaps
        } else if (file.relative === 'ordered-bundle-cbd3c3edb4.js') {
          fileContents.should.eql(
            ORDERED_BUNDLE_CONTENT +
            helpers.getJsSrcMapLine(file.relative));
        } else if (file.relative === 'ordered-bundle-d8d01cbb86.css') {
          fileContents.should.eql(
            ORDERED_BUNDLE_CSS_CONTENT +
            helpers.getCssSrcMapLine(file.relative));
        } else if (helpers.stringEndsWith(file.relative, '.map') ||
          file.relative === 'fonts/glyphicons-halflings-regular.eot' ||
          file.relative === 'fonts/glyphicons-halflings-regular.svg' ||
          file.relative === 'fonts/glyphicons-halflings-regular.ttf' ||
          file.relative === 'fonts/glyphicons-halflings-regular.woff' ||
          file.relative === 'images/empire_icon.png' ||
          file.relative === 'images/rebel_icon.png' ||
          file.relative === 'partials/a-partial-file.html' ) {
          staticFileCount++;
        } else {
          helpers.errorUnexpectedFileInStream(file);
        }
        fileCount++;
      }, function () {
        (fileCount).should.eql(28);
        (staticFileCount).should.eql(17);
      });

    });

    afterEach(function () {
      process.env.NODE_ENV = '';
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

  function testBundleStream(bundleConfigPath, appPath, done, testFunc, beforeEnd, bundleAllEnvironments) {
    gulp.src(bundleConfigPath)
      .pipe(bundler({
        bundleAllEnvironments: bundleAllEnvironments,
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
            return done(err);
          }
          done();
        });
      } else {
        done();
      }
    });
  }

});
