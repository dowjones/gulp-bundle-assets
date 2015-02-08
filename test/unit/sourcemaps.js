var libPath = './../../lib',
  sourcemaps = require(libPath + '/sourcemaps'),
  should = require('should');

describe('sourcemaps', function () {

  describe('isEnabled maps', function () {

    it('should return true when option undefined', function () {
      sourcemaps.isEnabled({
        bundleOptions: {
          maps: undefined
        }
      }).should.eql(true);
    });

    it('should return true when option true', function () {
      sourcemaps.isEnabled({
        bundleOptions: {
          maps: true
        }
      }).should.eql(true);
    });

    it('should return true when option null', function () {
      sourcemaps.isEnabled({
        bundleOptions: {
          maps: true
        }
      }).should.eql(true);
    });

    it('should return false', function () {
      sourcemaps.isEnabled({
        bundleOptions: {
          maps: false
        }
      }).should.eql(false);
    });

  });

  describe('isEnabled map', function () {

    it('should return true when option undefined', function () {
      sourcemaps.isEnabled({
        bundleOptions: {
          map: undefined
        }
      }).should.eql(true);
    });

    it('should return false', function () {
      sourcemaps.isEnabled({
        bundleOptions: {
          map: false
        }
      }).should.eql(false);
    });

  });

  describe('isEnabled sourcemap', function () {

    it('should return true when option undefined', function () {
      sourcemaps.isEnabled({
        bundleOptions: {
          sourcemap: undefined
        }
      }).should.eql(true);
    });

    it('should return false', function () {
      sourcemaps.isEnabled({
        bundleOptions: {
          sourcemap: false
        }
      }).should.eql(false);
    });

  });

  describe('isEnabled sourcemaps', function () {

    it('should return true when option undefined', function () {
      sourcemaps.isEnabled({
        bundleOptions: {
          sourcemaps: undefined
        }
      }).should.eql(true);
    });

    it('should return false', function () {
      sourcemaps.isEnabled({
        bundleOptions: {
          sourcemaps: false
        }
      }).should.eql(false);
    });

  });

});
