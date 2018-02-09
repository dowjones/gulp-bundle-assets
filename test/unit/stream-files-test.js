var libPath = './../../lib',
  should = require('should'),
  path = require('path'),
  sinon = require('sinon'),
  proxyquire = require('proxyquire');

describe('stream-files', function () {

  describe('attachStreamOptions', function () {

    var streamFiles = require(libPath + '/stream-files');

    it('should attach specific options to file obj', function () {

      var fakeFile = {};
      streamFiles.attachStreamOptions(fakeFile, {
        type: 'scripts',
        bundleName: 'my_bundle_name',
        isWatch: true,
        isBundleAll: false
      });

      fakeFile.bundleOptions.should.be.ok;
      fakeFile.bundleOptions.type.should.eql('scripts');
      fakeFile.bundleOptions.bundleName.should.eql('my_bundle_name');
      fakeFile.bundleOptions.isWatch.should.be.ok;
      fakeFile.bundleOptions.isBundleAll.should.not.be.ok;

    });

  });

});
