'use strict';
var libPath = './../../lib',
  path = require('path'),
  results = require(libPath + '/results'),
  rimraf = require('rimraf'),
  fs = require('fs'),
  should = require('should'),
  Bundle = require(libPath + '/model/bundle'),
  BundleKeys = require(libPath + '/model/bundle-keys'),
  File = require('vinyl');

describe('results', function () {

  var resultPath = path.join(__dirname, '.public');

  it('should verify results are written to disk', function (done) {

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

    // wait for the file to come back out
    stream.on('data', function (file) {
      // make sure it came out the same way it went in
      file.isBuffer().should.be.ok;
      file.bundle.should.be.ok;
    });

    stream.on('end', function () {

      var resultJsonPath = path.join(resultPath, 'bundle.result.json');

      fs.readFile(resultJsonPath, 'utf8', function (err, data) {
        if (err) throw done(err);

        (JSON.parse(data)).should.eql({
          "main": {
            "scripts": "<script src='main.js' type='text/javascript'></script>",
            "styles": "<link href='main.css' media='screen' rel='stylesheet' type='text/css'/>"
          }
        });
        done();
      });

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
