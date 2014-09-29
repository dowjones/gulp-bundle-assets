var libPath = '../../../lib',
  proxyquire = require('proxyquire'),
  sinon = require('sinon'),
  should = require('should');

describe('bundle-done', function () {

  it('should print message', function () {

    var prettyTimeStub = sinon.stub().returns('');

    var loggerStub = sinon.stub();
    loggerStub.log = sinon.spy();

    var bundleDone = proxyquire(libPath + '/watch/bundle-done', { 'pretty-hrtime': prettyTimeStub, '../service/logger': loggerStub });

    bundleDone('main.scripts', [ 1800216, 25 ]);

    prettyTimeStub.calledOnce.should.be.ok;
    loggerStub.log.calledOnce.should.be.ok;
    loggerStub.log.calledWith('Finished bundling').should.be.ok;

  });

});
