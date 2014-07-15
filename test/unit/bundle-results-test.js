'use strict';
var libPath = './../../lib',
  addBundleResults = require(libPath + '/bundle-results'),
  Bundle = require(libPath + '/bundle'),
  BundleType = require(libPath + '/bundle-type'),
  assert = require('assert'),
  File = require('vinyl');

it('should return result obj with one new entry', function () {
  var file = new File({
    base: '/app/public',
    path: '/app/public/main-bundle.js'
  });
  file.bundle = new Bundle({
    name: 'main',
    type: BundleType.JS
  });
  var expected = {
    main: {
      js: "<script type='text/javascript' src='/main-bundle.js'></script>"
    }
  };
  assert.deepEqual(addBundleResults({}, file), expected);
});

it('should return result obj new bundle type appended', function () {
  var currentBundleResults = {
    main: {
      js: "<script type='text/javascript' src='/main-bundle.js'></script>"
    }
  };
  var file = new File({
    base: '/app/public',
    path: '/app/public/main-bundle.css'
  });
  file.bundle = new Bundle({
    name: 'main',
    type: BundleType.CSS
  });
  var expected = {
    main: {
      js: "<script type='text/javascript' src='/main-bundle.js'></script>",
      css: "<link rel='stylesheet' href='/main-bundle.css' />"
    }
  };
  assert.deepEqual(addBundleResults(currentBundleResults, file), expected);
});

it('should return result obj new bundle appended', function () {
  var currentBundleResults = {
    main: {
      js: "<script type='text/javascript' src='/main-bundle.js'></script>",
      css: "<link rel='stylesheet' href='/main-bundle.css' />"
    }
  };
  var file = new File({
    base: '/app/public',
    path: '/app/public/vendor-bundle.js'
  });
  file.bundle = new Bundle({
    name: 'vendor',
    type: BundleType.JS
  });
  var expected = {
    main: {
      js: "<script type='text/javascript' src='/main-bundle.js'></script>",
      css: "<link rel='stylesheet' href='/main-bundle.css' />"
    },
    vendor: {
      js: "<script type='text/javascript' src='/vendor-bundle.js'></script>"
    }
  };
  assert.deepEqual(addBundleResults(currentBundleResults, file), expected);
});