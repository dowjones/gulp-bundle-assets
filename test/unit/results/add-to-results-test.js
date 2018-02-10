/* eslint-env node, mocha */

var libPath = './../../../lib',
  addBundleResults = require(libPath + '/results/add-to-results'),
  Bundle = require(libPath + '/model/bundle'),
  BundleType = require(libPath + '/model/bundle-type'),
  File = require('vinyl');

describe('add-to-results', function () {
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
      default_normal: {
        contents: {
          main: {
            scripts: "main-bundle.js"
          }
        },
        filename: 'bundle.result.json'
      }
    };
    addBundleResults({}, file, '', 'bundle.result').should.eql(expected);
  });

  it('should return result obj new bundle type appended', function () {
    var currentBundleResults = {
      "default_normal": {
        "contents": {
          main: {
            scripts: "main-bundle.js"
          }
        },
        filename: 'bundle.result.json'
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
      default_normal: {
        contents: {
          main: {
            scripts: "main-bundle.js",
            styles: "main-bundle.css"
          }
        },
        filename: 'bundle.result.json'
      }
    };
    addBundleResults(currentBundleResults, file, '', 'bundle.result').should.eql(expected);
  });

  it('should return result obj new bundle appended', function () {
    var currentBundleResults = {
      "default_normal": {
        "contents": {
          main: {
            scripts: "main-bundle.js",
            styles: "main-bundle.css"
          }
        },
        filename: 'bundle.result.json'
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
      default_normal: {
        contents: {
          main: {
            scripts: "main-bundle.js",
            styles: "main-bundle.css"
          },
          vendor: {
            scripts: "vendor-bundle.js"
          }
        },
        filename: 'bundle.result.json'
      }
    };
    addBundleResults(currentBundleResults, file, '', 'bundle.result').should.eql(expected);
  });

  describe('should return result obj given environments', function() {

    it('when result file name defined', function() {
      var file = new File({
        base: '/app/public',
        path: '/app/public/main-bundle.js'
      });
      file.bundle = new Bundle({
        name: 'main',
        type: BundleType.SCRIPTS
      });
      var expected = {
        default_normal: {
          contents: {
            main: {
              scripts: "main-bundle.js"
            }
          },
          filename: 'manifest.json'
        }
      };
      addBundleResults({}, file, '', 'manifest').should.eql(expected);
    });

    it('when result file name not defined', function() {
      var file = new File({
        base: '/app/public',
        path: '/app/public/main-bundle.js'
      });
      file.bundle = new Bundle({
        name: 'main',
        type: BundleType.SCRIPTS
      });
      var expected = {
        default_normal: {
          contents: {
            main: {
              scripts: "main-bundle.js"
            }
          },
          filename: 'bundle.result.json'
        }
      };
      addBundleResults({}, file, '', 'bundle.result').should.eql(expected);
    });
  });
});
