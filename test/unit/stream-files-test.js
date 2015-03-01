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
        streamFiles.handleTransformError = function (thisStream, isWatch, bundleName, bundleKey, err) {
          should.not.exist(isWatch);
          should.exist(thisStream);
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
        streamFiles.handleTransformError = function (thisStream, isWatch, bundleName, bundleKey, err) {
          should.not.exist(isWatch);
          should.exist(thisStream);
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

    it('should log errors during watch', function () {
      var mockLogger = {
        log: function () {
        }
      };
      var mockPipe = {
        emit: function () {
        }
      };
      var logSpy = sinon.spy(mockLogger, 'log');
      var pipeSpy = sinon.spy(mockPipe, 'emit');
      var streamFiles = proxyquire(libPath + '/stream-files', {
        './service/logger': mockLogger
      });
      var errObj = new Error('my err');
      streamFiles.handleTransformError(mockPipe, true, 'my_bundle_name', 'my_bundle_key', errObj);
      logSpy.calledTwice.should.be.ok;
      pipeSpy.calledOnce.should.be.ok;
      pipeSpy.withArgs('end').calledOnce.should.be.ok;
    });

    it('should process.exit when errors during bundle', function () {
      var mockProcessExit = sinon.spy(),
        origExit = process.exit;
      process.exit = mockProcessExit;

      var mockLogger = {
        log: function () {
        }
      };
      var logSpy = sinon.spy(mockLogger, 'log');
      var streamFiles = proxyquire(libPath + '/stream-files', {
        './service/logger': mockLogger
      });
      var errObj = new Error('my err');
      streamFiles.handleTransformError(null, undefined, 'my_bundle_name', 'my_bundle_key', errObj);
      logSpy.calledTwice.should.be.ok;
      mockProcessExit.calledOnce.should.be.ok;

      process.exit = origExit;
    });

  });

  describe('attachStreamOptions', function () {

    var streamFiles = require(libPath + '/stream-files');

    it('should attach specific options to file obj', function () {

      var fakeFile = {};
      streamFiles.attachStreamOptions(fakeFile, {
        env: 'production',
        type: 'scripts',
        bundleName: 'my_bundle_name',
        isWatch: true,
        isBundleAll: false
      });

      fakeFile.bundleOptions.should.be.ok;
      fakeFile.bundleOptions.env.should.eql('production');
      fakeFile.bundleOptions.type.should.eql('scripts');
      fakeFile.bundleOptions.bundleName.should.eql('my_bundle_name');
      fakeFile.bundleOptions.isWatch.should.be.ok;
      fakeFile.bundleOptions.isBundleAll.should.not.be.ok;

    });

  });

});
