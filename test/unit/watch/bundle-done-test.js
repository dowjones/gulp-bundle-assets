var libPath = '../../../lib',
  proxyquire = require('proxyquire'),
  sinon = require('sinon'),
  should = require('should');

describe('bundle-done', function () {

  it('should print message', function () {

    var prettyTimeStub = sinon.stub().returns('');

    var callback = sinon.spy();
    var mockFile = {};
    var loggerStub = sinon.stub();
    loggerStub.log = sinon.spy();

    var bundleDone = proxyquire(libPath + '/watch/bundle-done', { 'pretty-hrtime': prettyTimeStub, '../service/logger': loggerStub });

    bundleDone('main.scripts', [ 1800216, 25 ], callback, mockFile);

    prettyTimeStub.calledOnce.should.be.ok;
    loggerStub.log.calledOnce.should.be.ok;
    loggerStub.log.calledWith('Finished bundling').should.be.ok;
      
    callback.calledOnce.should.be.ok;
    callback.calledWith(mockFile).should.be.ok;
  });

});
