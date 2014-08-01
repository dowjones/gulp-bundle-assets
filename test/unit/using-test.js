var libPath = './../../lib',
  should = require('should'),
  BundleType = require(libPath + '/model/bundle-type'),
  proxyquire = require('proxyquire');

describe('using', function() {

  it('should log when bundle', function (done) {
    var gusingStub = function(opts) {
      opts.should.eql({
        prefix: 'Bundle "main.' + BundleType.SCRIPTS + '" using'
      });
      done();
    };
    var using = proxyquire(libPath + '/using', { 'gulp-using': gusingStub });

    using('main', BundleType.SCRIPTS);
  });

  it('should log when copy', function (done) {
    var gusingStub = function(opts) {
      opts.should.eql({
        prefix: 'Copy file'
      });
      done();
    };
    var using = proxyquire(libPath + '/using', { 'gulp-using': gusingStub });

    using('a.copy.file');
  });

  it('should log when bundle and env', function (done) {
    var gusingStub = function(opts) {
      opts.should.eql({
        prefix: 'Bundle "main.' + BundleType.SCRIPTS + '" using'
      });
      done();
    };
    var using = proxyquire(libPath + '/using', { 'gulp-using': gusingStub });

    using('main', BundleType.SCRIPTS, 'production');
  });

  it('should log when bundle, env and bundleAllEnvironments', function (done) {
    var gusingStub = function(opts) {
      opts.should.eql({
        prefix: 'Bundle "production.main.' + BundleType.SCRIPTS + '" using'
      });
      done();
    };
    var using = proxyquire(libPath + '/using', { 'gulp-using': gusingStub });

    using('main', BundleType.SCRIPTS, 'production', true);
  });

  it('should log when bundle, env and bundleAllEnvironments', function (done) {
    var gusingStub = function(opts) {
      opts.should.eql({
        prefix: 'Bundle "default.main.' + BundleType.SCRIPTS + '" using'
      });
      done();
    };
    var using = proxyquire(libPath + '/using', { 'gulp-using': gusingStub });

    using('main', BundleType.SCRIPTS, '', true);
  });

});
