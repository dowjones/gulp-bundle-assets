'use strict';
var libPath = './../../lib',
  isEnabled = require(libPath + '/is-enabled'),
  should = require('should');

describe('is-enabled', function() {

  it('should default to true', function () {
    isEnabled().should.be.ok;
  });

  it('should NOT happen when false', function () {
    isEnabled(false).should.not.be.ok;
  });

  it('should happen when true', function () {
    isEnabled(true).should.be.ok;
  });

  it('should happen when NODE_ENV=production and uglify:"production"', function () {
    isEnabled("production", 'production').should.be.ok;
  });

  it('should NOT happen when NODE_ENV=dev and uglify:"production"', function () {
    isEnabled("production", 'dev').should.not.be.ok;
  });

  it('should happen when NODE_ENV=staging and uglify:["production","staging"]', function () {
    isEnabled(["production","staging"], 'staging').should.be.ok;
  });

  it('should NOT happen when NODE_ENV=dev and uglify:["production","staging"]', function () {
    isEnabled(["production","staging"], 'dev').should.not.be.ok;
  });

  it('should NOT happen when NODE_ENV=NULL and uglify:"production"', function () {
    isEnabled("production").should.not.be.ok;
  });

});
