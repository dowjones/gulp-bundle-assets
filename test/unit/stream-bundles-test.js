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

      var streams = streamBundles(config);

      (streams.length).should.eql(1);

      mergeStream.apply(null, streams)
        .pipe(through.obj(function (file, enc, cb) {
          file.relative.should.eql('content/a.js');
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

    });

    describe('object notation', function () {
      it('should support src string', function (done) {

        var config = {
          copy: {
            src: './content/a.js'
          },
          base: path.join(__dirname, '../fixtures')
        };

        var streams = streamBundles(config);

        (streams.length).should.eql(1);

        mergeStream.apply(null, streams)
          .pipe(through.obj(function (file, enc, cb) {
            file.relative.should.eql('content/a.js');
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

      });

      it('should support with base', function (done) {

        var config = {
          copy: {
            src: './content/a.js',
            base: './content'
          },
          base: path.join(__dirname, '../fixtures')
        };

        var streams = streamBundles(config);

        (streams.length).should.eql(1);

        mergeStream.apply(null, streams)
          .pipe(through.obj(function (file, enc, cb) {
            file.relative.should.eql('a.js');
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

      });
    });

    describe('array notation', function () {
      it('should work with strings', function (done) {

        var config = {
          copy: [
            './content/a.js'
          ]
        };

        var streams = streamBundles(config);

        (streams.length).should.eql(1);

        mergeStream.apply(null, streams)
          .pipe(through.obj(function (file, enc, cb) {
            file.relative.should.eql('content/a.js');
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

      });

    });

    describe('should error', function () {

      it('when copy is num', function () {

        (function() {
          streamBundles({
            copy: 1
          });
        }).should.throw(gutil.PluginError);

      });

      it('when copy is bool', function () {

        (function() {
          streamBundles({
            copy: true
          });
        }).should.throw(gutil.PluginError);

      });

    });

  });

});
