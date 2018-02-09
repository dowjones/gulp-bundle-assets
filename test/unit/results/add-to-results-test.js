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
      default_normal: {
        contents: {
          main: {
            scripts: "<script src='main-bundle.js' type='text/javascript'></script>"
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
      default_normal: {
        contents: {
          main: {
            scripts: "<script src='main-bundle.js' type='text/javascript'></script>",
            styles: "<link href='main-bundle.css' media='all' rel='stylesheet' type='text/css'/>"
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
      default_normal: {
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
              scripts: "<script src='main-bundle.js' type='text/javascript'></script>"
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
              scripts: "<script src='main-bundle.js' type='text/javascript'></script>"
            }
          },
          filename: 'bundle.result.json'
        }
      };
      addBundleResults({}, file, '', 'bundle.result').should.eql(expected);
    });
  });

  describe('unprocessed file output', function() {
    it ('should sort output according to alphanumeric order', function() {
      var file = new File({
        base: '/app/public',
        path: '/app/public/main-bundle.js'
      });
      file.bundle = new Bundle({
        name: 'main',
        type: BundleType.SCRIPTS,
        srcFiles: ['main-a.js', 'main-b.js']
      });
      var expected = {
        default_normal: {
          contents: {
            main: {
              scripts: "<script src='/public/main-bundle.js' type='text/javascript'></script>"
            }
          },
          filename: 'bundle.result.json'
        },
        default_raw: {
          contents: {
            main: {
              scripts: [
                "<script src='/public/src/main-a.js' type='text/javascript'></script>",
                "<script src='/public/src/main-b.js' type='text/javascript'></script>"
              ]
            }
          },
          filename: "bundle.source.json"
        }
      };
      addBundleResults({}, file, '/public/', 'bundle.result', 'bundle.source', '/public/src/', true).should.eql(expected);
    });

    it('should maintain bundle order when not sorted', function () {
      var file = new File({
        base: '/app/public',
        path: '/app/public/main-bundle.js'
      });
      file.bundle = new Bundle({
        name: 'main',
        type: BundleType.SCRIPTS,
        srcFiles: ['main-b.js', 'main-a.js']
      });
      var expected = {
        default_normal: {
          contents: {
            main: {
              scripts: "<script src='/public/main-bundle.js' type='text/javascript'></script>"
            }
          },
          filename: 'bundle.result.json'
        },
        default_raw: {
          contents: {
            main: {
              scripts: [
                "<script src='/public/src/main-b.js' type='text/javascript'></script>",
                "<script src='/public/src/main-a.js' type='text/javascript'></script>"
              ]
            }
          },
          filename: "bundle.source.json"
        }
      };
      addBundleResults({}, file, '/public/', 'bundle.result', 'bundle.source', '/public/src/', false).should.eql(expected);
    });
  });
});
