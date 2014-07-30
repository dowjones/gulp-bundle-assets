'use strict';
var libPath = './../../../lib',
  ConfigModel = require(libPath + '/model/config'),
  should = require('should');

describe('config', function () {
  it('should create object with defaults', function () {
    var config = new ConfigModel({
      bundle: {},
      copy: {}
    });
    config.bundle.should.eql({});
    config.copy.should.eql({});
    config.base.should.eql('.');
  });
});
