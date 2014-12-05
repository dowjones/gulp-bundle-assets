var libPath = './../../../lib',
  addBundleResults = require(libPath + '/results/add-to-results'),
  Bundle = require(libPath + '/model/bundle'),
  BundleType = require(libPath + '/model/bundle-type'),
  should = require('should'),
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
      default: {
        contents: {
          main: {
            scripts: "<script src='main-bundle.js' type='text/javascript'></script>"
          }
        },
        filename: 'bundle.result.json'
      }
    };
    addBundleResults({}, file).should.eql(expected);
  });

  it('should return result obj new bundle type appended', function () {
    var currentBundleResults = {
      "default": {
        "contents": {
          main: {
            scripts: "<script src='main-bundle.js' type='text/javascript'></script>"
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
      default: {
        contents: {
          main: {
            scripts: "<script src='main-bundle.js' type='text/javascript'></script>",
            styles: "<link href='main-bundle.css' media='all' rel='stylesheet' type='text/css'/>"
          }
        },
        filename: 'bundle.result.json'
      }
    };
    addBundleResults(currentBundleResults, file).should.eql(expected);
  });

  it('should return result obj new bundle appended', function () {
    var currentBundleResults = {
      "default": {
        "contents": {
          main: {
            scripts: "<script src='main-bundle.js' type='text/javascript'></script>",
            styles: "<link href='main-bundle.css' media='all' rel='stylesheet' type='text/css'/>"
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
      default: {
        contents: {
          main: {
            scripts: "<script src='main-bundle.js' type='text/javascript'></script>",
            styles: "<link href='main-bundle.css' media='all' rel='stylesheet' type='text/css'/>"
          },
          vendor: {
            scripts: "<script src='vendor-bundle.js' type='text/javascript'></script>"
          }
        },
        filename: 'bundle.result.json'
      }
    };
    addBundleResults(currentBundleResults, file).should.eql(expected);
  });

  describe('should return result obj given environments', function() {

    it('when one env defined', function() {
      var file = new File({
        base: '/app/public',
        path: '/app/public/main-bundle.js'
      });
      file.bundle = new Bundle({
        name: 'main',
        type: BundleType.SCRIPTS,
        env: 'production'
      });
      var expected = {
        default: {
          contents: {
            main: {
              scripts: "<script src='main-bundle.js' type='text/javascript'></script>"
            }
          },
          filename: 'bundle.result.json'
        }
      };
      addBundleResults({}, file).should.eql(expected);
    });

    it('when multiple envs defined', function() {
      var file = new File({
        base: '/app/public',
        path: '/app/public/main-bundle.js'
      });
      file.bundle = new Bundle({
        name: 'main',
        type: BundleType.SCRIPTS,
        env: 'production',
        bundleAllEnvironments: true
      });
      var expected = {
        production: {
          contents: {
            main: {
              scripts: "<script src='main-bundle.js' type='text/javascript'></script>"
            }
          },
          filename: 'bundle.result.production.json'
        }
      };
      addBundleResults({}, file).should.eql(expected);
    });

    it('when result file name and env defined', function() {
      var file = new File({
        base: '/app/public',
        path: '/app/public/main-bundle.js'
      });
      file.bundle = new Bundle({
        name: 'main',
        type: BundleType.SCRIPTS,
        env: 'production',
        bundleAllEnvironments: true
      });
      var expected = {
        production: {
          contents: {
            main: {
              scripts: "<script src='main-bundle.js' type='text/javascript'></script>"
            }
          },
          filename: 'manifest.production.json'
        }
      };
      addBundleResults({}, file, null, 'manifest').should.eql(expected);
    });

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
        default: {
          contents: {
            main: {
              scripts: "<script src='main-bundle.js' type='text/javascript'></script>"
            }
          },
          filename: 'manifest.json'
        }
      };
      addBundleResults({}, file, null, 'manifest').should.eql(expected);
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
        default: {
          contents: {
            main: {
              scripts: "<script src='main-bundle.js' type='text/javascript'></script>"
            }
          },
          filename: 'bundle.result.json'
        }
      };
      addBundleResults({}, file, null, null).should.eql(expected);
    });

  });
});
