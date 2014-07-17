'use strict';
var libPath = './../../lib',
  path = require('path'),
  through = require('through2'),
  mergeStream = require('merge-stream'),
  streamBundles = require(libPath + '/stream-bundles.js'),
  should = require('should'),
  gutil = require('gulp-util');

describe('stream-bundles', function () {

  describe('copy', function () {

    var fileCount;

    beforeEach(function () {
      fileCount = 0;
    });

    it('should support simple string', function (done) {

      var config = {
        copy: './content/a.js',
        base: path.join(__dirname, '../fixtures')
      };

      verifyStreamBundlesOneFile(config, done, function (file) {
        file.relative.should.eql('content/a.js');
      });

    });

    describe('object notation', function () {
      it('should support src string', function (done) {

        var config = {
          copy: {
            src: './content/a.js'
          },
          base: path.join(__dirname, '../fixtures')
        };

        verifyStreamBundlesOneFile(config, done, function (file) {
          file.relative.should.eql('content/a.js');
        });

      });

      it('should support with base', function (done) {

        var config = {
          copy: {
            src: './content/a.js',
            base: './content'
          },
          base: path.join(__dirname, '../fixtures')
        };

        verifyStreamBundlesOneFile(config, done, function (file) {
          file.relative.should.eql('a.js');
        });

      });
    });

    describe('array notation', function () {
      it('should work with strings', function (done) {

        var config = {
          copy: [
            './content/a.js'
          ],
          base: path.join(__dirname, '../fixtures')
        };

        verifyStreamBundlesOneFile(config, done, function (file) {
          file.relative.should.eql('content/a.js');
        });

      });

      it('should work with objects', function (done) {

        var config = {
          copy: [
            {
              src: './content/a.js'
            }
          ],
          base: path.join(__dirname, '../fixtures')
        };

        verifyStreamBundlesOneFile(config, done, function (file) {
          file.relative.should.eql('content/a.js');
        });

      });

      it('should work with objects with base', function (done) {

        var config = {
          copy: [
            {
              src: './content/a.js',
              base: './content'
            }
          ],
          base: path.join(__dirname, '../fixtures')
        };

        verifyStreamBundlesOneFile(config, done, function (file) {
          file.relative.should.eql('a.js');
        });

      });

      it('should work with objects array src', function (done) {

        var config = {
          copy: [
            {
              src: [
                './content/a.js'
              ]
            }
          ],
          base: path.join(__dirname, '../fixtures')
        };

        verifyStreamBundlesOneFile(config, done, function (file) {
          file.relative.should.eql('content/a.js');
        });

      });

      it('should work with objects with base and array src', function (done) {

        var config = {
          copy: [
            {
              src: [
                './content/a.js'
              ],
              base: './content'
            }
          ],
          base: path.join(__dirname, '../fixtures')
        };

        verifyStreamBundlesOneFile(config, done, function (file) {
          file.relative.should.eql('a.js');
        });

      });

    });

    describe('should error', function () {

      it('when copy is num', function () {

        (function () {
          streamBundles({
            copy: 1
          });
        }).should.throw(gutil.PluginError);

      });

      it('when copy is bool', function () {

        (function () {
          streamBundles({
            copy: true
          });
        }).should.throw(gutil.PluginError);

      });

    });

    function verifyStreamBundlesOneFile(config, done, fn) {
      var streams = streamBundles(config);

      (streams.length).should.eql(1);

      mergeStream.apply(null, streams)
        .pipe(through.obj(function (file, enc, cb) {
          if (fn) fn(file);
          fileCount++;
          this.push(file);
          cb();
        }))
        .on('data', function () {
        }) // noop
        .on('end', function () {
          (fileCount).should.eql(1);
          done();
        });

    }

  });

});

