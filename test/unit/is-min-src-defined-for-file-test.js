var libPath = './../../lib',
  should = require('should'),
  File = require('vinyl'),
  BundleType = require(libPath + '/model/bundle-type'),
  isMinSrcDefinedForFile = require(libPath + '/is-min-src-defined-for-file'),
  path = require('path');

describe('is-min-src-defined-for-file', function () {

  it('should return true for src file', function () {
    var aFile = new File({
      cwd: "/",
      base: "/test/",
      path: "/test/file.js",
      contents: new Buffer("")
    });
    var minSrcsObj = {
      main: {}
    };
    minSrcsObj.main[BundleType.SCRIPTS] = [
      {
        src: 'file.js',
        minSrc: 'file.min.js'
      }
    ];
    isMinSrcDefinedForFile(aFile, minSrcsObj, 'main', BundleType.SCRIPTS).should.be.ok;
  });

  it('should return true for minSrc file', function () {
    var aFile = new File({
      cwd: "/",
      base: "/test/",
      path: "/test/file.min.js",
      contents: new Buffer("")
    });
    var minSrcsObj = {
      main: {}
    };
    minSrcsObj.main[BundleType.SCRIPTS] = [
      {
        src: 'file.js',
        minSrc: 'file.min.js'
      }
    ];
    isMinSrcDefinedForFile(aFile, minSrcsObj, 'main', BundleType.SCRIPTS).should.be.ok;
  });

  it('should return false when file not in obj', function () {
    var aFile = new File({
      cwd: "/",
      base: "/test/",
      path: "/test/file-with-no-min-src-defined.js",
      contents: new Buffer("")
    });
    var minSrcsObj = {
      main: {}
    };
    minSrcsObj.main[BundleType.SCRIPTS] = [
      {
        src: 'file.js',
        minSrc: 'file.min.js'
      }
    ];
    isMinSrcDefinedForFile(aFile, minSrcsObj, 'main', BundleType.SCRIPTS).should.not.be.ok;
  });

  it('should return true for complex obj', function () {
    var aFile = new File({
      cwd: "/",
      base: "/test/",
      path: "/test/content/file-to-find.min.js",
      contents: new Buffer("")
    });
    var minSrcsObj = {
      main: {},
      vendor: {},
      header: {}
    };
    minSrcsObj.main[BundleType.SCRIPTS] = [
      {
        src: path.normalize('content/file.js'),
        minSrc: path.normalize('content/file.min.js')
      },
      {
        minSrc: path.normalize('content/file-with-no-src.js')
      },
      {
        src: path.normalize('content/file2.js'),
        minSrc: path.normalize('content/file2.min.js')
      }
    ];
    minSrcsObj.vendor[BundleType.SCRIPTS] = [
      {
        src: path.normalize('content/file.js'),
        minSrc: path.normalize('content/file.min.js')
      }
    ];
    minSrcsObj.header[BundleType.SCRIPTS] = [
      {
        src: path.normalize('content/file-to-find.js'),
        minSrc: path.normalize('content/file-to-find.min.js')
      }
    ];
    isMinSrcDefinedForFile(aFile, minSrcsObj, 'header', BundleType.SCRIPTS).should.be.ok;
  });

  it('should return true for styles', function () {
    var aFile = new File({
      cwd: "/",
      base: "/test/",
      path: "/test/file.min.css",
      contents: new Buffer("")
    });
    var minSrcsObj = {
      main: {}
    };
    minSrcsObj.main[BundleType.STYLES] = [
      {
        src: 'file.css',
        minSrc: 'file.min.css'
      }
    ];
    isMinSrcDefinedForFile(aFile, minSrcsObj, 'main', BundleType.STYLES).should.be.ok;
  });

  it('should return false when that bundle is not defined', function () {
    var aFile = new File({
      cwd: "/",
      base: "/test/",
      path: "/test/file.css",
      contents: new Buffer("")
    });
    isMinSrcDefinedForFile(aFile, {}, 'main', BundleType.STYLES).should.not.be.ok;
  });

  it('should return false when file not in given bundle', function () {
    var aFile = new File({
      cwd: "/",
      base: "/test/",
      path: "/test/file.js",
      contents: new Buffer("")
    });
    var minSrcsObj = {
      main: {
        src: 'file.js',
        minSrc: 'file.min.js'
      }
    };
    isMinSrcDefinedForFile(aFile, minSrcsObj, 'vendor', BundleType.STYLES).should.not.be.ok;
  });
});
