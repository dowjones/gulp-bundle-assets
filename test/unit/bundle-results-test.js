'use strict';
var libPath = './../../lib',
  addBundleResults = require(libPath + '/add-bundle-results'),
  Bundle = require(libPath + '/model/bundle'),
  BundleType = require(libPath + '/model/bundle-type'),
  assert = require('assert'),
  File = require('vinyl');

describe('bundle-results', function () {
  it('should return result obj with one new entry', function () {
    var file = new File({
      base: '/app/public',
      path: '/app/public/main-bundle.js'
    });
    file.bundle = new Bundle({
      name: 'main',
      type: BundleType.SCRIPTS
    });
    var expected = {
      main: {
        scripts: "<script src='main-bundle.js' type='text/javascript'></script>"
      }
    };
    assert.deepEqual(addBundleResults({}, file), expected);
  });

  it('should return result obj new bundle type appended', function () {
    var currentBundleResults = {
      main: {
        scripts: "<script src='main-bundle.js' type='text/javascript'></script>"
      }
    };
    var file = new File({
      base: '/app/public',
      path: '/app/public/main-bundle.css'
    });
    file.bundle = new Bundle({
      name: 'main',
      type: BundleType.STYLES
    });
    var expected = {
      main: {
        scripts: "<script src='main-bundle.js' type='text/javascript'></script>",
        styles: "<link href='main-bundle.css' media='screen' rel='stylesheet' type='text/css'/>"
      }
    };
    assert.deepEqual(addBundleResults(currentBundleResults, file), expected);
  });

  it('should return result obj new bundle appended', function () {
    var currentBundleResults = {
      main: {
        scripts: "<script src='main-bundle.js' type='text/javascript'></script>",
        styles: "<link href='main-bundle.css' media='screen' rel='stylesheet' type='text/css'/>"
      }
    };
    var file = new File({
      base: '/app/public',
      path: '/app/public/vendor-bundle.js'
    });
    file.bundle = new Bundle({
      name: 'vendor',
      type: BundleType.SCRIPTS
    });
    var expected = {
      main: {
        scripts: "<script src='main-bundle.js' type='text/javascript'></script>",
        styles: "<link href='main-bundle.css' media='screen' rel='stylesheet' type='text/css'/>"
      },
      vendor: {
        scripts: "<script src='vendor-bundle.js' type='text/javascript'></script>"
      }
    };
    assert.deepEqual(addBundleResults(currentBundleResults, file), expected);
  });
});
