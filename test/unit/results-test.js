'use strict';
var libPath = './../../lib',
  path = require('path'),
  rimraf = require('rimraf'),
  fs = require('fs'),
  should = require('should'),
  Bundle = require(libPath + '/model/bundle'),
  BundleKeys = require(libPath + '/model/bundle-keys'),
  File = require('vinyl'),
  proxyquire = require('proxyquire');

describe('results', function () {

  var resultPath = path.join(__dirname, '.public');

  it('should verify results are written to disk', function (done) {

    var mkdirpStub = function (dest, cb) {
      (dest).should.eql(resultPath);
      cb();
    };
    var fsStub = {
      writeFile: function (writePath, data, cb) {
        (writePath).should.eql(path.join(resultPath, 'bundle.result.json'));
        (JSON.parse(data)).should.eql({
          "main": {
            "scripts": "<script src='main.js' type='text/javascript'></script>",
            "styles": "<link href='main.css' media='screen' rel='stylesheet' type='text/css'/>"
          }
        });
        cb();
      }
    };
    // stubbing file sys calls using proxyquire makes this test approx 10x faster (100ms down to 10ms)
    var results = proxyquire(libPath + '/results', { 'mkdirp': mkdirpStub, 'fs': fsStub });

    var fakeFile = new File({
      base: '/app/public',
      path: '/app/public/main.js',
      contents: new Buffer('main_bundle_content')
    });
    fakeFile.bundle = new Bundle({
      name: 'main',
      type: BundleKeys.SCRIPTS
    });

    var fakeFile2 = new File({
      base: '/app/public',
      path: '/app/public/main.css',
      contents: new Buffer('vendor_bundle_content')
    });
    fakeFile2.bundle = new Bundle({
      name: 'main',
      type: BundleKeys.STYLES
    });

    var stream = results(resultPath);

    stream.on('data', function (file) {
      // make sure it came out the same way it went in
      file.isBuffer().should.be.ok;
      file.bundle.should.be.ok;
    });

    stream.on('end', function () {
      done();
    });

    stream.write(fakeFile);
    stream.write(fakeFile2);
    stream.end();
  });

  afterEach(function (done) {
    rimraf(resultPath, function (err) {
      if (err) {
        done(err);
      }
      done();
    });
  });
});
