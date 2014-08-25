'use strict';
var libPath = './../../../lib',
  bundleToHtml = require(libPath + '/results/bundle-to-html.js'),
  BundleType = require(libPath + '/model/bundle-type'),
  should = require('should');

describe('bundle-to-html', function() {
  it('should get script bundle html string', function () {
    bundleToHtml[BundleType.SCRIPTS]('/main-bundle.js').should.eql(
      "<script src='/main-bundle.js' type='text/javascript'></script>");
  });

  it('should get style bundle html string', function () {
    bundleToHtml[BundleType.STYLES]('/main-bundle.css').should.eql(
      "<link href='/main-bundle.css' media='screen' rel='stylesheet' type='text/css'/>");
  });

  it('should throw error when format type not defined', function () {
    (function () {
      bundleToHtml.resource('/fake-name.js');
    }).should.throw();
  });
});
