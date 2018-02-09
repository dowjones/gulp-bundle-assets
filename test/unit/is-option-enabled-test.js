/* eslint-env node, mocha */

'use strict';
var libPath = './../../lib',
  isEnabled = require(libPath + '/is-option-enabled');

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

});
