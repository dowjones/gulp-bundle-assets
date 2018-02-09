'use strict';
var libPath = './../../../lib',
  ConfigModel = require(libPath + '/model/config'),
  should = require('should'),
  File = require('vinyl');

describe('config', function () {

  it('should create object with defaults', function () {
    var configModel = new ConfigModel({
      bundle: {},
      copy: {}
    });
    configModel.bundle.should.eql({});
    configModel.copy.should.eql({});
    configModel.options.base.should.eql('.');
  });

  it('should create object given basic config', function () {
    var config = {
      bundle: {
        vendor: { scripts: "./lib/*.js", styles: "./**/*.css" }
      }, copy: {
        src: "./font/*.*"
      }
    };
    var configModel = new ConfigModel(config);
    configModel.bundle.should.eql(config.bundle);
    configModel.copy.should.eql(config.copy);
    configModel.options.base.should.eql('.');
  });

  it('should create object given basic config and options', function () {

    var opts = {
      base: '/test/'
    };
    var configModel = new ConfigModel({ bundle: {}, copy: {} }, opts);
    configModel.bundle.should.eql({});
    configModel.copy.should.eql({});
    configModel.options.base.should.eql('/test/');
  });

  describe('should throw error', function () {

    it('when no file or config given', function () {
      (function () {
        new ConfigModel();
      }).should.throw(/^Configuration file should be in the form "{ bundle: {}, copy: {} }"/);
    });

    it('when no bundle or copy property provided', function () {
      (function () {
        new ConfigModel({ junk: {} });
      }).should.throw(/^Configuration file should be in the form "{ bundle: {}, copy: {} }"/);
    });

    // todo more test cases for verifying config

  });

});
