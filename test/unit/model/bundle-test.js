var libPath = './../../../lib',
  BundleConfig = require(libPath + '/model/bundle'),
  BundleType = require(libPath + '/model/bundle-type'),
  should = require('should');

describe('bundle', function () {

  it('should create bundle obj with defaults', function () {
    var bundle = new BundleConfig();
    (bundle.name === null).should.be.true;
    (bundle.type === null).should.be.true;
  });

  it('should create bundle obj values', function () {
    var bundle = new BundleConfig({
      name: 'vendor',
      type: BundleType.SCRIPTS
    });
    bundle.name.should.eql('vendor');
    bundle.type.should.eql(BundleType.SCRIPTS);
  });

});
