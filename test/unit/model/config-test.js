'use strict';
var libPath = './../../../lib',
  ConfigModel = require(libPath + '/model/config'),
  should = require('should'),
  File = require('vinyl');

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
  it('should create object with defaults given vinyl', function () {
    var aFile = new File({
      cwd: "/",
      base: "/test/",
      path: "/test/config.js",
      contents: new Buffer('module.exports = { bundle: {}, copy: {} };')
    });
    var config = new ConfigModel(aFile);
    config.bundle.should.eql({});
    config.copy.should.eql({});
    config.base.should.eql('.');
  });
});
