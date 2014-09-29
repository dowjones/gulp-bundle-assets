var libPath = './../../../../lib',
  BundleType = require(libPath + '/model/bundle-type'),
  should = require('should'),
  File = require('vinyl'),
  sinon = require('sinon'),
  proxyquire = require('proxyquire');

describe('result type', function () {

  var resultTypeFunc,
    loggerStub;

  beforeEach(function() {
    loggerStub = {
      log: sinon.spy()
    };
    resultTypeFunc = proxyquire(libPath + '/results/type', { '../../service/logger': loggerStub });
  });

  it('should result with default scripts line', function () {

    var fakeFile = new File({
      cwd: "/",
      base: "/test/",
      path: "/test/file.js",
      contents: new Buffer("")
    });
    fakeFile.bundle = {
      type: BundleType.SCRIPTS,
      result: {
        type: 'html'
      }
    };

    var resultLine = resultTypeFunc(fakeFile, '/public/');

    resultLine.should.eql("<script src='/public/file.js' type='text/javascript'></script>");

    loggerStub.log.called.should.not.be.ok;

  });

  it('should result with default styles line', function () {

    var fakeFile = new File({
      cwd: "/",
      base: "/test/",
      path: "/test/file.css",
      contents: new Buffer("")
    });
    fakeFile.bundle = {
      type: BundleType.STYLES,
      result: {
        type: 'html'
      }
    };

    var resultLine = resultTypeFunc(fakeFile, '/public/');

    resultLine.should.eql("<link href='/public/file.css' media='all' rel='stylesheet' type='text/css'/>");

    loggerStub.log.called.should.not.be.ok;

  });

  it('should return jsx script', function () {

    var fakeFile = new File({
      cwd: "/",
      base: "/test/",
      path: "/test/file.js",
      contents: new Buffer("")
    });
    fakeFile.bundle = {
      type: BundleType.SCRIPTS,
      result: {
        type: 'jsx'
      }
    };

    var resultLine = resultTypeFunc(fakeFile, '/public/');

    resultLine.should.eql("<script src='/public/file.js' type='text/jsx'></script>");

    loggerStub.log.called.should.not.be.ok;

  });

  it('should return default type when custom one not found', function () {

    var fakeFile = new File({
      cwd: "/",
      base: "/test/",
      path: "/test/file.js",
      contents: new Buffer("")
    });
    fakeFile.bundle = {
      type: BundleType.SCRIPTS,
      result: {
        type: 'this_type_does_not_exist'
      }
    };

    var resultLine = resultTypeFunc(fakeFile, '/public/');

    resultLine.should.eql("<script src='/public/file.js' type='text/javascript'></script>");

    loggerStub.log.calledOnce.should.be.ok;

  });

  it('should result when specific per type', function () {

    var resultOptions = {
      type: {
        scripts: 'jsx',
        styles: 'plain'
      }
    };

    var fakeFile = new File({
      cwd: "/",
      base: "/test/",
      path: "/test/file.js",
      contents: new Buffer("")
    });
    fakeFile.bundle = {
      type: BundleType.SCRIPTS,
      result: resultOptions
    };

    var fakeFile2 = new File({
      cwd: "/",
      base: "/test/",
      path: "/test/file.css",
      contents: new Buffer("")
    });
    fakeFile2.bundle = {
      type: BundleType.STYLES,
      result: resultOptions
    };

    var resultLine = resultTypeFunc(fakeFile);
    resultLine.should.eql("<script src='file.js' type='text/jsx'></script>");
    var resultLine2 = resultTypeFunc(fakeFile2);
    resultLine2.should.eql("file.css");

    loggerStub.log.called.should.not.be.ok;

  });

  it('should result when object but none specified for type', function () {

    var fakeFile = new File({
      cwd: "/",
      base: "/test/",
      path: "/test/file.css",
      contents: new Buffer("")
    });
    fakeFile.bundle = {
      type: BundleType.STYLES,
      result: {
        type: {
          scripts: 'jsx'
        }
      }
    };

    var resultLine = resultTypeFunc(fakeFile);
    resultLine.should.eql("<link href='file.css' media='all' rel='stylesheet' type='text/css'/>");

    loggerStub.log.called.should.not.be.ok;

  });

  it('should throw error when junk resulter given', function () {

    var fakeFile = new File({
      cwd: "/",
      base: "/test/",
      path: "/test/file.js",
      contents: new Buffer("")
    });
    fakeFile.bundle = {
      type: BundleType.SCRIPTS,
      result: {
        type: true
      }
    };

    (function() {
      resultTypeFunc(fakeFile);
    }).should.throw(/^Failed to load result function/);

    loggerStub.log.called.should.not.be.ok;

  });

});
