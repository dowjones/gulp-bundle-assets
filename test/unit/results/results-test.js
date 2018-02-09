var libPath = './../../../lib',
  path = require('path'),
  fs = require('fs'),
  should = require('should'),
  Bundle = require(libPath + '/model/bundle'),
  BundleKeys = require(libPath + '/model/bundle-keys'),
  File = require('vinyl'),
  sinon = require('sinon'),
  proxyquire = require('proxyquire');

describe('results', function () {

  var resultPath,
    mkdirpStub,
    fancyLogStub,
    results;

  beforeEach(function() {
    resultPath = path.join(__dirname, '.public');
    mkdirpStub = function (dest, cb) {
      (dest).should.eql(resultPath);
      cb();
    };
    fancyLogStub = function () {
      //noop for less noisy output
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
              "scripts": "main.js",
              "styles": "main.css"
            }
          });
          cb();
        }
      };

      // stubbing file sys calls using proxyquire makes this test approx 10x faster (100ms down to 10ms)
      results = proxyquire(libPath + '/results', { 'mkdirp': mkdirpStub, 'graceful-fs': fsStub, 'fancy-log': fancyLogStub });

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
              "scripts": "/public/main.js",
              "styles": "/public/main.css"
            }
          });
          cb();
        }
      };

      results = proxyquire(libPath + '/results', { 'mkdirp': mkdirpStub, 'graceful-fs': fsStub, 'fancy-log': fancyLogStub });

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
    
    it('should write results path in a posix way', function (done) {

      var fsStub = {
        writeFile: function (writePath, data, cb) {
          (writePath).should.eql(path.join(resultPath, 'bundle.result.json'));
          (JSON.parse(data)).should.eql({
            "main": {
              "scripts": "/public/main.js",
              "styles": "/public/main.css"
            }
          });
          cb();
        }
      };

      results = proxyquire(libPath + '/results', { 'mkdirp': mkdirpStub, 'graceful-fs': fsStub, 'fancy-log': fancyLogStub });

      var stream = results({
        dest: resultPath,
        pathPrefix: '\\public\\'
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

  describe('custom', function() {

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

    it('should write results to correct file when file name option given', function (done) {

      var customFileName = 'manifest';

      var fsStub = {
        writeFile: function (writePath, data, cb) {
          (writePath).should.eql(path.join(resultPath, customFileName + '.json'));
          (JSON.parse(data)).should.eql({
            "main": {
              "scripts": "/public/main.js",
              "styles": "/public/main.css"
            }
          });
          cb();
        }
      };

      results = proxyquire(libPath + '/results', { 'mkdirp': mkdirpStub, 'graceful-fs': fsStub, 'fancy-log': fancyLogStub });

      var stream = results({
        fileName: customFileName,
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

  describe('incremental', function() {

    var jsFile,
      cssFile;

    var FsStub = function(resultFileName) {
      var fileCount = 0;

      this.writeFile = function (writePath, data, cb) {
        (writePath).should.eql(path.join(resultPath, resultFileName));
        if (fileCount === 0) {
          (JSON.parse(data)).should.eql({
            "main": {
              "scripts": "main.js"
            }
          });
        } else {
          data.indexOf('other').should.be.lessThan(data.indexOf('main'));
          (JSON.parse(data)).should.eql({
            "other": {
              "styles": "main.css"
            },
            "main": {
              "scripts": "main.js"
            }
          });
        }
        fileCount++;
        cb();
      };

      this.readFile = function (readPath, enc, cb) {
        (readPath).should.eql(path.join(resultPath, resultFileName));
        cb(null, JSON.stringify({
          "main": {
            "scripts": "main.js"
          }
        }));
      };

      this.exists = function(existsPath, cb) {
        (existsPath).should.eql(path.join(resultPath, resultFileName));
        cb(fileCount !== 0);
      };
    };

    beforeEach(function() {
      jsFile = new File({
        base: '/app/public',
        path: '/app/public/main.js',
        contents: new Buffer('main_bundle_content')
      });
      jsFile.bundle = new Bundle({
        name: 'main',
        type: BundleKeys.SCRIPTS,
        result: { bundleOrder: ['other', 'main'] }
      });

      cssFile = new File({
        base: '/app/public',
        path: '/app/public/main.css',
        contents: new Buffer('vendor_bundle_content')
      });
      cssFile.bundle = new Bundle({
        name: 'other',
        type: BundleKeys.STYLES,
        result: { bundleOrder: ['other', 'main'] }
      });

    });

  });

});
