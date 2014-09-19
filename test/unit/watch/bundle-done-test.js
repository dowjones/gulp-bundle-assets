var libPath = '../../../lib',
  proxyquire = require('proxyquire'),
  sinon = require('sinon'),
  should = require('should');

describe('bundle-done', function () {

  it('should print message', function () {

    var prettyTimeStub = sinon.stub().returns('');

    var gutilStub = sinon.stub();
    gutilStub.log = sinon.spy();

    var bundleDone = proxyquire(libPath + '/watch/bundle-done', { 'pretty-hrtime': prettyTimeStub, 'gulp-util': gutilStub });

    bundleDone('main.scripts', [ 1800216, 25 ]);

    prettyTimeStub.calledOnce.should.be.ok;
    gutilStub.log.calledOnce.should.be.ok;
    gutilStub.log.calledWith('Finished bundling').should.be.ok;

  });

});
