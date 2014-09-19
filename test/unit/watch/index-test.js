var libPath = '../../../lib',
  path = require('path'),
  proxyquire = require('proxyquire'),
  sinon = require('sinon'),
  should = require('should');

describe('watch index', function () {

  it('should call stream bundles', function () {

    var streamBundlesWatch = sinon.spy();

    var watch = proxyquire(libPath + '/watch/index', { '../stream-bundles-watch': streamBundlesWatch });

    watch({
      configPath: path.join(__dirname, '../../fixtures/configs/valid-bundle-field.js')
    });

    streamBundlesWatch.calledOnce.should.be.ok;
    streamBundlesWatch.getCall(0).args[0].bundle.should.eql({
        main: {
          js: 'some/file'
        }
      });
    streamBundlesWatch.getCall(0).args[0].options.should.be.ok;

  });

  it('should throw err when configPath not defined', function () {

    var streamBundlesWatch = sinon.spy();

    var watch = proxyquire(libPath + '/watch/index', { '../stream-bundles-watch': streamBundlesWatch });

    (function () {
      watch();
    }).should.throw();

  });

  it('should throw err when configPath does not exist', function () {

    var streamBundlesWatch = sinon.spy();

    var watch = proxyquire(libPath + '/watch/index', { '../stream-bundles-watch': streamBundlesWatch });

    (function () {
      watch({
        configPath: 'this/path/does/not/exist'
      });
    }).should.throw();

  });

});
