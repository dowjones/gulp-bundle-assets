var libPath = './../../../lib',
  transformHelper = require(libPath + '/transform_helper'),
  File = require('vinyl'),
  gulp = require('gulp'),
  through = require('through2'),
  browserify = require('browserify'),
  path = require('path'),
  sourceStream = require('vinyl-source-stream'),
  multiline = require('multiline'),
  helpers = require('../../helpers');

var expectedFileContent = multiline(function(){/*
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = function (n) { return n * 111 };
},{}],2:[function(require,module,exports){
module.exports = function(str) {
  return str.length;
};
},{}],3:[function(require,module,exports){
var foo = require('./foo.js');
var bar = require('./lib/bar.js');
var elem = document.getElementById('result');
var x = foo(100) + bar('baz');
elem.textContent = x;
},{"./foo.js":1,"./lib/bar.js":2}]},{},[3])
*/});

describe('transform_helper', function () {

  it('should take browserify entry and return browserified file', function (testDone) {

    var browserifyStream = function (file, done) {
      browserify({
        entries: [file.path],
        debug: true
      })
        .bundle()
        .pipe(sourceStream('app.js')) // convert to gulp stream
        .pipe(done);
    };

    gulp.src(path.join(__dirname, '../../fixtures/browserify/main.js'))
      .pipe(transformHelper.browserify(browserifyStream)())
      .pipe(through.obj(function (file, enc, cb) {

        file.relative.should.eql('app.js');

        var fileContents = '';
        file.contents
          .on('data', function (chunk) {
            fileContents += chunk.toString();
          })
          .on('error', function (err) {
            testDone(err);
          })
          .on('end', function () {
            var sourceMapLine = fileContents.substring(fileContents.lastIndexOf("\n//# sourceMappingURL="), fileContents.length);
            sourceMapLine.should.be.ok;
            var mainFileContents = fileContents.replace(sourceMapLine, '');
            mainFileContents.should.eql(expectedFileContent);
            testDone();
          });

        this.push(file);
        cb();
      }));

  });

  // TODO put back once issue is fixed in gulp-less https://github.com/plus3network/gulp-less/issues/207
  
  //it('should lessify file', function (done) {
  //  gulp.src(path.join(__dirname, '../../fixtures/content/a.less'))
  //    .pipe(transformHelper.less()())
  //    .pipe(through.obj(function (file, enc, cb) {
  //      file.relative.should.eql('a.css');
  //      file.contents.toString().should.eql('#header {\n  color: #5b83ad;\n}\n');
  //      this.push(file);
  //      cb();
  //      done();
  //    }));
  //});

});
