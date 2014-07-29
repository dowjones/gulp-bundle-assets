'use strict';
var libPath = './../../lib',
  isEnabled = require(libPath + '/is-enabled'),
  should = require('should');

describe('should-uglify', function() {

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
    process.env.NODE_ENV = 'production';
    isEnabled("production").should.be.ok;
  });

  it('should NOT happen when NODE_ENV=dev and uglify:"production"', function () {
    process.env.NODE_ENV = 'dev';
    isEnabled("production").should.not.be.ok;
  });

  it('should happen when NODE_ENV=staging and uglify:["production","staging"]', function () {
    process.env.NODE_ENV = 'staging';
    isEnabled(["production","staging"]).should.be.ok;
  });

  it('should NOT happen when NODE_ENV=dev and uglify:["production","staging"]', function () {
    process.env.NODE_ENV = 'dev';
    isEnabled(["production","staging"]).should.not.be.ok;
  });

  it('should NOT happen when NODE_ENV=NULL and uglify:"production"', function () {
    isEnabled("production").should.not.be.ok;
  });

  afterEach(function() {
    process.env.NODE_ENV = null;
  });

});
