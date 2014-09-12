var libPath = './../../../lib',
  path = require('path'),
  rimraf = require('rimraf'),
  fs = require('fs'),
  should = require('should'),
  Bundle = require(libPath + '/model/bundle'),
  BundleKeys = require(libPath + '/model/bundle-keys'),
  File = require('vinyl'),
  proxyquire = require('proxyquire');

describe('results', function () {

  var resultPath,
    mkdirpStub,
    gutilStub,
    results;

  beforeEach(function() {
    resultPath = path.join(__dirname, '.public');
    mkdirpStub = function (dest, cb) {
      (dest).should.eql(resultPath);
      cb();
    };
    gutilStub = {
      log: function () {
        //noop for less noisy output
      }
    };
  });

  describe('regular', function() {

    var jsFile,
      cssFile;

    beforeEach(function() {
      jsFile = new File({
        base: '/app/public',
        path: '/app/public/main.js',
        contents: new Buffer('main_bundle_content')
      });
      jsFile.bundle = new Bundle({
        name: 'main',
        type: BundleKeys.SCRIPTS
      });

      cssFile = new File({
        base: '/app/public',
        path: '/app/public/main.css',
        contents: new Buffer('vendor_bundle_content')
      });
      cssFile.bundle = new Bundle({
        name: 'main',
        type: BundleKeys.STYLES
      });
    });

    it('should write results when given string filePath', function (done) {

      var fsStub = {
        writeFile: function (writePath, data, cb) {
          (writePath).should.eql(path.join(resultPath, 'bundle.result.json'));
          (JSON.parse(data)).should.eql({
            "main": {
              "scripts": "<script src='main.js' type='text/javascript'></script>",
              "styles": "<link href='main.css' media='all' rel='stylesheet' type='text/css'/>"
            }
          });
          cb();
        }
      };

      // stubbing file sys calls using proxyquire makes this test approx 10x faster (100ms down to 10ms)
      results = proxyquire(libPath + '/results', { 'mkdirp': mkdirpStub, 'graceful-fs': fsStub, 'gulp-util': gutilStub });

      var stream = results(resultPath);

      stream.on('data', function (file) {
        // make sure it came out the same way it went in
        file.isBuffer().should.be.ok;
        file.bundle.should.be.ok;
      });

      stream.on('end', function () {
        done();
      });

      stream.write(jsFile);
      stream.write(cssFile);
      stream.end();
    });

    it('should write results when given options obj', function (done) {

      var fsStub = {
        writeFile: function (writePath, data, cb) {
          (writePath).should.eql(path.join(resultPath, 'bundle.result.json'));
          (JSON.parse(data)).should.eql({
            "main": {
              "scripts": "<script src='/public/main.js' type='text/javascript'></script>",
              "styles": "<link href='/public/main.css' media='all' rel='stylesheet' type='text/css'/>"
            }
          });
          cb();
        }
      };

      results = proxyquire(libPath + '/results', { 'mkdirp': mkdirpStub, 'graceful-fs': fsStub, 'gulp-util': gutilStub });

      var stream = results({
        dest: resultPath,
        pathPrefix: '/public/'
      });

      stream.on('data', function (file) {
        // make sure it came out the same way it went in
        file.isBuffer().should.be.ok;
        file.bundle.should.be.ok;
      });

      stream.on('end', function () {
        done();
      });

      stream.write(jsFile);
      stream.write(cssFile);
      stream.end();
    });

  });

  describe('bundleAllEnvironments', function() {

    it('should write results for one env', function (done) {

      var jsFile = new File({
        base: '/app/public',
        path: '/app/public/main.production.js',
        contents: new Buffer('main_bundle_content')
      });
      jsFile.bundle = new Bundle({
        name: 'main',
        type: BundleKeys.SCRIPTS,
        env: 'production',
        bundleAllEnvironments: true
      });

      var cssFile = new File({
        base: '/app/public',
        path: '/app/public/main.production.css',
        contents: new Buffer('vendor_bundle_content')
      });
      cssFile.bundle = new Bundle({
        name: 'main',
        type: BundleKeys.STYLES,
        env: 'production',
        bundleAllEnvironments: true
      });

      var fsStub = {
        writeFile: function (writePath, data, cb) {
          (writePath).should.eql(path.join(resultPath, 'bundle.result.production.json'));
          (JSON.parse(data)).should.eql({
            "main": {
              "scripts": "<script src='/public/main.production.js' type='text/javascript'></script>",
              "styles": "<link href='/public/main.production.css' media='all' rel='stylesheet' type='text/css'/>"
            }
          });
          cb();
        }
      };

      results = proxyquire(libPath + '/results', { 'mkdirp': mkdirpStub, 'graceful-fs': fsStub, 'gulp-util': gutilStub });

      var stream = results({
        dest: resultPath,
        pathPrefix: '/public/'
      });

      stream.on('data', function (file) {
        // make sure it came out the same way it went in
        file.isBuffer().should.be.ok;
        file.bundle.should.be.ok;
      });

      stream.on('end', function () {
        done();
      });

      stream.write(jsFile);
      stream.write(cssFile);
      stream.end();
    });

    it('should write results for multiple envs', function (done) {

      var jsFile = new File({
        base: '/app/public',
        path: '/app/public/main.js',
        contents: new Buffer('main_bundle_content_js')
      });
      jsFile.bundle = new Bundle({
        name: 'main',
        type: BundleKeys.SCRIPTS,
        env: '',
        bundleAllEnvironments: true
      });

      var cssFile = new File({
        base: '/app/public',
        path: '/app/public/main.css',
        contents: new Buffer('main_bundle_content_css')
      });
      cssFile.bundle = new Bundle({
        name: 'main',
        type: BundleKeys.STYLES,
        env: '',
        bundleAllEnvironments: true
      });

      var jsFile2 = new File({
        base: '/app/public',
        path: '/app/public/vendor.js',
        contents: new Buffer('vendor_bundle_content_js')
      });
      jsFile2.bundle = new Bundle({
        name: 'vendor',
        type: BundleKeys.SCRIPTS,
        env: '',
        bundleAllEnvironments: true
      });

      var jsFileProd = new File({
        base: '/app/public',
        path: '/app/public/main.production.js',
        contents: new Buffer('main_bundle_prod_content_js')
      });
      jsFileProd.bundle = new Bundle({
        name: 'main',
        type: BundleKeys.SCRIPTS,
        env: 'production',
        bundleAllEnvironments: true
      });

      var cssFileProd = new File({
        base: '/app/public',
        path: '/app/public/main.production.css',
        contents: new Buffer('vendor_bundle_prod_content_css')
      });
      cssFileProd.bundle = new Bundle({
        name: 'main',
        type: BundleKeys.STYLES,
        env: 'production',
        bundleAllEnvironments: true
      });

      var jsFileProd2 = new File({
        base: '/app/public',
        path: '/app/public/vendor.production.js',
        contents: new Buffer('vendor_bundle_prod_content_js')
      });
      jsFileProd2.bundle = new Bundle({
        name: 'vendor',
        type: BundleKeys.SCRIPTS,
        env: 'production',
        bundleAllEnvironments: true
      });

      var fileCount = 0,
        resultFileCount = 0;

      var fsStub = {
        writeFile: function (writePath, data, cb) {
          resultFileCount++;
          if (path.join(resultPath, 'bundle.result.production.json') === writePath) {
            (JSON.parse(data)).should.eql({
              "main": {
                "scripts": "<script src='/public/main.production.js' type='text/javascript'></script>",
                "styles": "<link href='/public/main.production.css' media='all' rel='stylesheet' type='text/css'/>"
              },
              "vendor": {
                "scripts": "<script src='/public/vendor.production.js' type='text/javascript'></script>"
              }
            });
          } else if (path.join(resultPath, 'bundle.result.json') === writePath) {
            (JSON.parse(data)).should.eql({
              "main": {
                "scripts": "<script src='/public/main.js' type='text/javascript'></script>",
                "styles": "<link href='/public/main.css' media='all' rel='stylesheet' type='text/css'/>"
              },
              "vendor": {
                "scripts": "<script src='/public/vendor.js' type='text/javascript'></script>"
              }
            });
          } else {
            throw new Error('Unexpected result file in stream ' + writePath);
          }
          cb();
        }
      };

      results = proxyquire(libPath + '/results', { 'mkdirp': mkdirpStub, 'graceful-fs': fsStub, 'gulp-util': gutilStub });

      var stream = results({
        dest: resultPath,
        pathPrefix: '/public/'
      });

      stream.on('data', function (file) {
        // make sure it came out the same way it went in
        file.isBuffer().should.be.ok;
        file.bundle.should.be.ok;
        fileCount++;
      });

      stream.on('end', function () {
        (fileCount).should.eql(6);
        (resultFileCount).should.eql(2);
        done();
      });

      stream.write(jsFile);
      stream.write(cssFile);
      stream.write(jsFile2);
      stream.write(jsFileProd);
      stream.write(cssFileProd);
      stream.write(jsFileProd2);
      stream.end();
    });

  });

});
