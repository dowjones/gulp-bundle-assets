/* eslint-env node, mocha */

'use strict';
var libPath = './../../lib',
  pathifySrc = require(libPath + '/pathify-config-src'),
  path = require('path');

describe('pathify-config-src', function () {

  describe('string', function () {

    it('should echo basic', function () {
      pathifySrc('./content/a.js').should.eql('./content/a.js');
    });

    it('should leave alone when base is "."', function () {
      pathifySrc('./content/a.js', '.').should.eql('./content/a.js');
    });

    it('should modify when base is something', function () {
      pathifySrc('./content/a.js', '/absolute/path/').should.eql(path.normalize('/absolute/path/content/a.js'));
    });

  });

  describe('array', function () {

    it('should echo basic', function () {
      pathifySrc(['./content/a.js']).should.eql(['./content/a.js']);
    });

    it('should leave alone when base is "."', function () {
      pathifySrc(['./content/a.js'], '.').should.eql(['./content/a.js']);
    });

    it('should modify when base is something', function () {
      pathifySrc(['./content/a.js'], '/absolute/path/').should.eql([path.normalize('/absolute/path/content/a.js')]);
    });

  });

  describe('should error', function () {

    var errorMsgRegex = /^Config parse error\. Invalid bundle path detected\. Expected string or array but got/;

    it('when src is undefined', function () {
      (function () {
        pathifySrc();
      }).should.throw(errorMsgRegex);
    });

    it('when src is null', function () {
      (function () {
        pathifySrc(null);
      }).should.throw(errorMsgRegex);
    });

    it('when src is number', function () {
      (function () {
        pathifySrc(1);
      }).should.throw(errorMsgRegex);
    });

  });

});
