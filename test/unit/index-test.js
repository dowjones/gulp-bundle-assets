'use strict';
var fs = require('fs'),
  gulp = require('gulp'),
  path = require('path'),
  gutil = require('gulp-util'),
  proxyquire = require('proxyquire'),
  should = require('should'),
  sinon = require('sinon');

describe('index', function () {

  var bundle,
    streamBunldesStub,
    cwdPath = path.join(__dirname, '../..');

  beforeEach(function () {
    streamBunldesStub = sinon.spy(function (config) {
      return [
        fs.createReadStream(path.join(__dirname, '../fixtures/content/a.js'))
      ];
    });
    bundle = proxyquire('../../index', { './lib/stream-bundles': streamBunldesStub });
  });

  describe('should bundle', function () {

    it('when only bundle key defined', function (done) {
      gulp.src(path.join(__dirname, '../fixtures/configs/valid-bundle-field.js'))
        .pipe(bundle())
        .on('data', function () {
        }) //noop
        .on('error', function (err) {
          done(err);
        })
        .on('end', function () {
          should(streamBunldesStub.getCall(0).args[0]).eql({
            bundle: {
              main: {
                js: 'some/file'
              }
            },
            file: {
              "base": path.join(cwdPath, "/test/fixtures/configs/"),
              "cwd": cwdPath,
              "path": path.join(cwdPath, "/test/fixtures/configs/valid-bundle-field.js"),
              "relative": "valid-bundle-field.js"
            },
            options: {
              base: '.'
            }
          });
          done();
        });
    });

    it('when only config key defined', function (done) {
      gulp.src(path.join(__dirname, '../fixtures/configs/valid-copy-field.js'))
        .pipe(bundle())
        .on('data', function () {
        }) //noop
        .on('error', function (err) {
          done(err);
        })
        .on('end', function () {
          should(streamBunldesStub.getCall(0).args[0]).eql({
            copy: 'some/file',
            file: {
              "base": path.join(cwdPath, "/test/fixtures/configs/"),
              "cwd": cwdPath,
              "path": path.join(cwdPath, "/test/fixtures/configs/valid-copy-field.js"),
              "relative": "valid-copy-field.js"
            },
            options: {
              base: '.'
            }
          });
          done();
        });
    });

  });

  describe('should throw error', function () {

    it('when no supported fields', function (done) {
      gulp.src(path.join(__dirname, '../fixtures/configs/no-supported-fields.js'))
        .pipe(bundle())
        .on('data', function () {
        }) //noop
        .on('error', function (err) {
          err.should.be.an.instanceof(gutil.PluginError);
          err.message.should.startWith('Configuration file should');
          done();
        })
        .on('end', function () {
          done(new Error('Plugin should have thrown error'));
        });
    });

  });
});