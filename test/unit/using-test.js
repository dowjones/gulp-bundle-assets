var libPath = './../../lib',
  should = require('should'),
  BundleType = require(libPath + '/model/bundle-type'),
  File = require('vinyl'),
  proxyquire = require('proxyquire'),
  ANSI_GREEN = "\u001B[32m",
  ANSI_MAGENTA = "\u001B[35m",
  ANSI_DEFAULT = "\u001B[39m";

describe('using', function () {

  var fakeFile;

  beforeEach(function () {
    fakeFile = new File({
      cwd: '/',
      base: '/test',
      path: '/test/file.js',
      contents: new Buffer('yo')
    });
  });

  function getUsing(gutilStub) {
    return proxyquire(libPath + '/using', { 'gulp-util': gutilStub });
  }

  function run(usingStream, done) {
    usingStream.write(fakeFile);
    usingStream.once('data', function (file) {
      should(file.isBuffer()).be.ok;
      done();
    });
  }

  describe('bundle', function() {

    it('should log basic', function (done) {
      var gutilStub = {
        log: function(prefix, suffix) {
          prefix.should.eql("Bundle '" + ANSI_GREEN + "main." + BundleType.SCRIPTS + ANSI_DEFAULT + "' using");
          suffix.should.eql(ANSI_MAGENTA + "file.js" + ANSI_DEFAULT);
        }
      };
      var usingStream = getUsing(gutilStub).bundle('main', BundleType.SCRIPTS);
      run(usingStream, done);
    });

    it('should log when env', function (done) {
      var gutilStub = {
        log: function(prefix, suffix) {
          prefix.should.eql("Bundle '" + ANSI_GREEN + "main." + BundleType.SCRIPTS + ANSI_DEFAULT + "' using");
          suffix.should.eql(ANSI_MAGENTA + "file.js" + ANSI_DEFAULT);
        }
      };
      var usingStream = getUsing(gutilStub).bundle('main', BundleType.SCRIPTS, 'production');
      run(usingStream, done);
    });

    it('should log when env and bundleAllEnvironments', function (done) {
      var gutilStub = {
        log: function(prefix, suffix) {
          prefix.should.eql("Bundle '" + ANSI_GREEN + "production.main." + BundleType.SCRIPTS + ANSI_DEFAULT + "' using");
          suffix.should.eql(ANSI_MAGENTA + "file.js" + ANSI_DEFAULT);
        }
      };
      var usingStream = getUsing(gutilStub).bundle('main', BundleType.SCRIPTS, 'production', true);
      run(usingStream, done);
    });

    it('should log as default when env and bundleAllEnvironments', function (done) {
      var gutilStub = {
        log: function(prefix, suffix) {
          prefix.should.eql("Bundle '" + ANSI_GREEN + "default.main." + BundleType.SCRIPTS + ANSI_DEFAULT + "' using");
          suffix.should.eql(ANSI_MAGENTA + "file.js" + ANSI_DEFAULT);
        }
      };
      var usingStream = getUsing(gutilStub).bundle('main', BundleType.SCRIPTS, '', true);
      run(usingStream, done);
    });

  });

  describe('copy', function() {

    it('should log basic', function (done) {
      var gutilStub = {
        log: function(prefix, suffix) {
          prefix.should.eql("Copy file");
          suffix.should.eql(ANSI_MAGENTA + "test/file.js" + ANSI_DEFAULT);
        }
      };
      var usingStream = getUsing(gutilStub).copy('.');
      run(usingStream, done);
    });

    it('should log given base', function (done) {
      var gutilStub = {
        log: function(prefix, suffix) {
          prefix.should.eql("Copy file");
          suffix.should.eql(ANSI_MAGENTA + "file.js" + ANSI_DEFAULT);
        }
      };
      var usingStream = getUsing(gutilStub).copy('/test');
      run(usingStream, done);
    });

  });

});
