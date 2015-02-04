var libPath = './../../lib',
  should = require('should'),
  path = require('path'),
  sinon = require('sinon'),
  proxyquire = require('proxyquire'),
  transformHelper = require(libPath + '/transform_helper');

describe('stream-files', function () {


  describe('streamers', function () {

    var streamFiles = require(libPath + '/stream-files');

    describe('styles', function () {

      it('should call error handler when custom transform fails', function (done) {
        streamFiles.handleTransformError = function (bundleName, bundleKey, err) {
          bundleName.should.eql('main');
          bundleKey.should.eql('styles');
          //should(err).typeof('object');
          console.log(err);
          done();
        };
        var opts = {
          src: path.join(__dirname, '../fixtures/content/broken.less'),
          minSrcs: {},
          bundleName: 'main',
          env: 'development',
          isBundleAll: false,
          bundleOptions: {
            result: null,
            transforms: {
              styles: transformHelper.less()
            }
          }
        };
        streamFiles.styles(opts);
      });

    });

    describe('scripts', function () {

      it('should call error handler when custom transform fails', function (done) {
        streamFiles.handleTransformError = function (bundleName, bundleKey, err) {
          bundleName.should.eql('main');
          bundleKey.should.eql('scripts');
          //should(err).typeof('object');
          console.log(err);
          done();
        };
        var opts = {
          src: path.join(__dirname, '../fixtures/content/broken.coffee'),
          minSrcs: {},
          bundleName: 'main',
          env: 'development',
          isBundleAll: false,
          bundleOptions: {
            result: null,
            transforms: {
              scripts: transformHelper.coffee()
            }
          }
        };
        streamFiles.scripts(opts);
      });

    });

  });


  describe('handleTransformError', function () {

    var mockLogger = {
      log: function () {
      }
    };
    var spy = sinon.spy(mockLogger, 'log');
    var streamFiles = proxyquire(libPath + '/stream-files', {
      './service/logger': mockLogger
    });

    it('should log errors', function () {
      var errObj = new Error('my err');
      streamFiles.handleTransformError('my_bundle_name', 'my_bundle_key', errObj);
      spy.calledTwice.should.be.ok;
      spy.withArgs(errObj).calledOnce.should.be.ok;
    });

  });

});
