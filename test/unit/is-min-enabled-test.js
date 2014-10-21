var libPath = './../../lib',
  should = require('should'),
  sinon = require('sinon'),
  proxyquire = require('proxyquire'),
  File = require('vinyl');

describe('is-min-enabled', function () {

  describe('when option enabled', function () {

    var fileStub,
      isOptionEnabledStub,
      opts;

    beforeEach(function () {
      var fileStub = new File({
        cwd: "/",
        base: "/test/",
        path: "/test/file",
        contents: new Buffer("")
      });
      isOptionEnabledStub = sinon.stub().returns(true);
      opts = {
        bundleOptions: {}
      };
    });

    it('and min src defined should return true', function () {
      var isMinSrcDefinedForFileStub = sinon.stub().returns(false);
      var isMinEnabled = proxyquire(libPath + '/is-min-enabled', {
        './is-min-src-defined-for-file': isMinSrcDefinedForFileStub,
        './is-option-enabled': isOptionEnabledStub
      });
      isMinEnabled.js(fileStub, opts).should.be.ok;
      isMinEnabled.css(fileStub, opts).should.be.ok;
    });

    it('and min src NOT defined should return false', function () {
      var isMinSrcDefinedForFileStub = sinon.stub().returns(true);
      var isMinEnabled = proxyquire(libPath + '/is-min-enabled', {
        './is-min-src-defined-for-file': isMinSrcDefinedForFileStub,
        './is-option-enabled': isOptionEnabledStub
      });
      isMinEnabled.js(fileStub, opts).should.be.not.ok;
      isMinEnabled.css(fileStub, opts).should.be.not.ok;
    });

  });

  describe('when getMinCssOption called', function () {
    var opts,
      isMinEnabled = require(libPath + '/is-min-enabled');

    beforeEach(function () {
      opts = {
        bundleOptions: {
        }
      };
    });

    it('should return minCSS key', function () {
      opts.bundleOptions.minCSS = false;
      should(isMinEnabled.getMinCssOption(opts)).eql(false);
    });

    it('should return minCss key', function () {
      opts.bundleOptions.minCss = false;
      should(isMinEnabled.getMinCssOption(opts)).eql(false);
    });

  });

});
