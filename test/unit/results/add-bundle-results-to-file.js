'use strict';
var libPath = './../../../lib',
  addBundleResults = require(libPath + '/results/add-bundle-results-to-file'),
  BundleType = require(libPath + '/model/bundle-type'),
  should = require('should'),
  File = require('vinyl');

describe('add-bundle-results-to-file', function () {

  it('should append bundle info to file', function (done) {

    var fakeFile = new File({
      contents: new Buffer('')
    });

    var abrs = addBundleResults('main', BundleType.SCRIPTS, 'production', true);

    abrs.write(fakeFile);

    abrs.once('data', function(file) {
      file.isBuffer().should.be.true;

      file.contents.toString('utf8').should.eql('');
      file.bundle.should.be.ok;
      file.bundle.name.should.eql('main');
      file.bundle.type.should.eql(BundleType.SCRIPTS);
      file.bundle.env.should.eql('production');
      file.bundle.bundleAllEnvironments.should.eql(true);
      done();
    });

  });

});
