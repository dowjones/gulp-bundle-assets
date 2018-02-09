/* eslint-env node, mocha */

'use strict';
var libPath = './../../lib',
  path = require('path'),
  through = require('through2'),
  mergeStream = require('merge-stream'),
  streamBundles = require(libPath + '/stream-bundles.js'),
  PluginError = require('plugin-error');

describe('stream-bundles', function () {

  var fileCount;
  // trailing ; signifies minification happened

  beforeEach(function () {
    fileCount = 0;
  });

  function verifyFileStream(config, done, fn, expectedFileCount, expectedStreamCount) {
    var streams = streamBundles(config);//crashing here

    (streams.length).should.eql(typeof expectedStreamCount !== 'undefined' ? expectedStreamCount : 1);

    mergeStream.apply(mergeStream, streams)
      .pipe(through.obj(function (file, enc, cb) {
        if (fn) fn(file);
        fileCount++;
        this.push(file);
        cb();
      }))
      .on('data', function () {
      }) // noop
      .on('end', function () {
        (fileCount).should.eql(typeof expectedFileCount === 'undefined' ? 1 : expectedFileCount);
        done();
      });

  }

  describe('copy', function () {

    it('should support simple string', function (done) {

      var config = {
        copy: './content/a.js',
        options: {
          base: path.join(__dirname, '../fixtures')
        }
      };

      verifyFileStream(config, done, function (file) {
        file.relative.should.eql(path.normalize('content/a.js'));
      });

    });

    describe('object notation', function () {
      it('should support src string', function (done) {

        var config = {
          copy: {
            src: './content/a.js'
          },
          options: {
            base: path.join(__dirname, '../fixtures')
          }
        };

        verifyFileStream(config, done, function (file) {
          file.relative.should.eql(path.normalize('content/a.js'));
        });

      });

      it('should support with base', function (done) {

        var config = {
          copy: {
            src: './content/a.js',
            base: './content'
          },
          options: {
            base: path.join(__dirname, '../fixtures')
          }
        };

        verifyFileStream(config, done, function (file) {
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
          options: {
            base: path.join(__dirname, '../fixtures')
          }
        };

        verifyFileStream(config, done, function (file) {
          file.relative.should.eql(path.normalize('content/a.js'));
        });

      });

      it('should work with objects', function (done) {

        var config = {
          copy: [
            {
              src: './content/a.js'
            }
          ],
          options: {
            base: path.join(__dirname, '../fixtures')
          }
        };

        verifyFileStream(config, done, function (file) {
          file.relative.should.eql(path.normalize('content/a.js'));
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
          options: {
            base: path.join(__dirname, '../fixtures')
          }
        };

        verifyFileStream(config, done, function (file) {
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
          options: {
            base: path.join(__dirname, '../fixtures')
          }
        };

        verifyFileStream(config, done, function (file) {
          file.relative.should.eql(path.normalize('content/a.js'));
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
          options: {
            base: path.join(__dirname, '../fixtures')
          }
        };

        verifyFileStream(config, done, function (file) {
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
        }).should.throw(PluginError);

      });

      it('when copy is bool', function () {

        (function () {
          streamBundles({
            copy: true
          });
        }).should.throw(PluginError);

      });

      it('when copy is array and has invalid value: num', function () {

        (function () {
          streamBundles({
            copy: [
              1
            ]
          });
        }).should.throw(PluginError);

      });

      it('when copy is array and has invalid value: num', function () {

        (function () {
          streamBundles({
            copy: [
              true
            ]
          });
        }).should.throw(PluginError);

      });

      it('when copy is array and has invalid value: array', function () {

        (function () {
          streamBundles({
            copy: [
              ['./content/*.js']
            ]
          });
        }).should.throw(PluginError);

      });

    });

  });

});

