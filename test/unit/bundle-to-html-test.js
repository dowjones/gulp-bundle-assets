'use strict';
var libPath = './../../lib',
  bundleToHtml = require(libPath + '/bundle-to-html.js'),
  BundleType = require(libPath + '/model/bundle-type'),
  assert = require('assert');

describe('bundle-to-html', function() {
  it('should get script bundle html string', function () {
    assert.equal(bundleToHtml[BundleType.SCRIPTS]('/main-bundle.js'),
      "<script src='/main-bundle.js' type='text/javascript'></script>");
  });

  it('should get style bundle html string', function () {
    assert.equal(bundleToHtml[BundleType.STYLES]('/main-bundle.css'),
      "<link href='/main-bundle.css' media='screen' rel='stylesheet' type='text/css'/>");
  });

  it('should throw error when format type not defined', function () {
    assert.throws(function () {
      bundleToHtml.resource('/fake-name.js');
    });
  });
});
