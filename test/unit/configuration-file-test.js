'use strict';
var fs = require('fs'),
  gulp = require('gulp'),
  path = require('path'),
  gutil = require('gulp-util'),
  proxyquire = require('proxyquire'),
  should = require('should'),
  sinon = require('sinon');

describe('configuration-files', function () {

  var bundle,
    streamBunldesStub;

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
            base: '.'
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
            base: '.'
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