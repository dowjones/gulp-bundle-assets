'use strict';
var libPath = './../../lib',
  bundleToHtml = require(libPath + '/bundle-to-html.js'),
  BundleType = require(libPath + '/model/bundle-type'),
  assert = require('assert');

it('should get script bundle html string', function () {
  assert.equal(bundleToHtml[BundleType.JS]('/main-bundle.js'),
    "<script type='text/javascript' src='/main-bundle.js'></script>");
});

it('should get style bundle html string', function () {
  assert.equal(bundleToHtml[BundleType.CSS]('/main-bundle.css'),
    "<link rel='stylesheet' href='/main-bundle.css' />");
});

it('should throw error when format type not defined', function () {
  assert.throws(function () {
    bundleToHtml.resource('/fake-name.js');
  });
});