'use strict';
var libPath = './../../lib',
  path = require('path'),
  results = require(libPath + '/results'),
  rimraf = require('rimraf'),
  should = require('should'),
  File = require('vinyl');

describe('results', function () {

  var resultPath = path.join(__dirname, '.public');

  it('should verify results are written to disk', function (done) {

    var fakeFile = new File({
      base: '/app/public',
      path: '/app/public/main.js',
      contents: new Buffer('main_bundle_content')
    });

    var stream = results(resultPath);

    // wait for the file to come back out
    stream.on('data', function(file) {
      // make sure it came out the same way it went in
      file.isBuffer().should.be.ok;
      // check the contents
      file.contents.toString('utf8').should.eql('main_bundle_content');
    });

    stream.on('end', function() {
      done();
    });

    stream.write(fakeFile);
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
