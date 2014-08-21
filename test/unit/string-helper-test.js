var libPath = './../../lib',
  should = require('should'),
  stringHelper = require(libPath + '/string-helper');

describe('string-helper', function () {

  describe('endsWith', function () {

    it('should find', function () {
      stringHelper.endsWith('hello world', 'rld').should.be.ok;
    });

    it('should find when exact', function () {
      stringHelper.endsWith('/', '/').should.be.ok;
    });

    it('should not find', function () {
      stringHelper.endsWith('hello world', 'hello').should.not.be.ok;
    });

    describe('should throw error', function() {
      it('when str null', function() {
        (function() {
          stringHelper.endsWith(null, 'hello');
        }).should.throw(/^stringHelper.endsWith expected strings but got/);
      });

      it('when suffix null', function() {
        (function() {
          stringHelper.endsWith('asd');
        }).should.throw(/^stringHelper.endsWith expected strings but got/);
      });
    });
  });

});
