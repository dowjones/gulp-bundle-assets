var proxyquire = require('proxyquire'),
  sinon = require('sinon'),
  libPath = './../../lib',
  ConfigModel = require(libPath + '/model/config');

describe('stream-bundles-watch', function () {

  var streamBundlesWatch,
    gulpStub,
    watchReturn;

  beforeEach(function () {
    gulpStub = sinon.stub();
    watchReturn = sinon.stub();
  });

  it('should start watch', function (done) {

    watchReturn.on = function (eventName, fn) {
      eventName.should.eql('change');
      fn.should.be.type('function');
    };
    sinon.spy(watchReturn, 'on');
    gulpStub.watch = sinon.stub().returns(watchReturn);
    streamBundlesWatch = proxyquire(libPath + '/stream-bundles-watch',
      { 'gulp': gulpStub });

    var config = new ConfigModel({
      bundle: {
        main: {
          scripts: 'some/file.js',
          styles: 'some/file.css'
        }
      }
    }, {});

    streamBundlesWatch(config);

    gulpStub.watch.calledTwice.should.be.ok;
    watchReturn.on.calledTwice.should.be.ok;

    done();

  });

  it('should start watch for all environments', function (done) {

    watchReturn.on = function (eventName, fn) {
      eventName.should.eql('change');
      fn.should.be.type('function');
    };
    sinon.spy(watchReturn, 'on');
    gulpStub.watch = sinon.stub().returns(watchReturn);
    streamBundlesWatch = proxyquire(libPath + '/stream-bundles-watch',
      { 'gulp': gulpStub });

    var config = new ConfigModel({
      bundle: {
        main: {
          scripts: 'some/file.js',
          styles: 'some/file.css',
          options: {
            uglify: ['staging', 'production'],
            minCSS: ['staging', 'production']
          }
        }
      }
    }, {
      bundleAllEnvironments: true
    });

    streamBundlesWatch(config);

    gulpStub.watch.callCount.should.eql(6);
    watchReturn.on.callCount.should.eql(6);

    done();

  });

});
