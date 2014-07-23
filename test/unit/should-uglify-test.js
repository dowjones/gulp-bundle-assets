'use strict';
var libPath = './../../lib',
  shouldUglify = require(libPath + '/should-uglify'),
  should = require('should');

describe('should-uglify', function() {

  it('should default to true', function () {
    shouldUglify().should.be.ok;
  });

  it('should NOT happen when false', function () {
    shouldUglify(false).should.not.be.ok;
  });

  it('should happen when true', function () {
    shouldUglify(true).should.be.ok;
  });

  it('should happen when NODE_ENV=production and uglify:"production"', function () {
    process.env.NODE_ENV = 'production';
    shouldUglify("production").should.be.ok;
  });

  it('should NOT happen when NODE_ENV=dev and uglify:"production"', function () {
    process.env.NODE_ENV = 'dev';
    shouldUglify("production").should.not.be.ok;
  });

  it('should happen when NODE_ENV=staging and uglify:["production","staging"]', function () {
    process.env.NODE_ENV = 'staging';
    shouldUglify(["production","staging"]).should.be.ok;
  });

  it('should NOT happen when NODE_ENV=dev and uglify:["production","staging"]', function () {
    process.env.NODE_ENV = 'dev';
    shouldUglify(["production","staging"]).should.not.be.ok;
  });

  it('should NOT happen when NODE_ENV=NULL and uglify:"production"', function () {
    shouldUglify("production").should.not.be.ok;
  });

  afterEach(function() {
    process.env.NODE_ENV = null;
  });

});
