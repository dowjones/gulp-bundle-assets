/* eslint-env node, mocha */

'use strict';
var fs = require('fs'),
  gulp = require('gulp'),
  path = require('path'),
  proxyquire = require('proxyquire'),
  should = require('should'),
  sinon = require('sinon');

describe('index', function () {

  var bundle,
    streamBunldesStub,
    cwdPath = path.join(__dirname, '../..');

  beforeEach(function () {
    // `should` is smart enough to see that this isn't the real deal via prototype checks.
    // should.config.checkProtoEql = false; is used to get around this.
    streamBunldesStub = sinon.spy(function (/*config*/) {
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
          should.config.checkProtoEql = false;
          should(streamBunldesStub.getCall(0).args[0]).eql({
            bundle: {
              main: {
                js: 'some/file'
              }
            },
            file: {
              "base": path.join(cwdPath, "/test/fixtures/configs"),
              "cwd": cwdPath,
              "path": path.join(cwdPath, "/test/fixtures/configs/valid-bundle-field.js"),
              "relative": "valid-bundle-field.js"
            },
            options: {
              base: '.'
            }
          });
          should.config.checkProtoEql = true;
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
          // Either Gulp or JS (apon throw) is mangling the type, hence no 'PluginError'.
          err.should.be.an.instanceof(Error);
          err.message.should.startWith('Configuration file does not contain');
          done();
        })
        .on('end', function () {
          done(new Error('Plugin should have thrown error'));
        });
    });

  });
});