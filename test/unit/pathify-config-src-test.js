'use strict';
var libPath = './../../lib',
  pathifySrc = require(libPath + '/pathify-config-src'),
  should = require('should');

describe('pathify-config-src', function () {

  describe('string', function () {

    it('should echo basic', function () {
      pathifySrc('./content/a.js').should.eql('./content/a.js');
    });

    it('should leave alone when base is "."', function () {
      pathifySrc('./content/a.js', '.').should.eql('./content/a.js');
    });

    it('should modify when base is something', function () {
      pathifySrc('./content/a.js', '/absolute/path/').should.eql('/absolute/path/content/a.js');
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
      pathifySrc(['./content/a.js'], '/absolute/path/').should.eql(['/absolute/path/content/a.js']);
    });

  });

  describe('object', function () {

    it('should echo string as src', function () {
      pathifySrc({src: './content/a.js'}).should.eql('./content/a.js');
    });

    it('should echo array as src', function () {
      pathifySrc({src: ['./content/a.js']}).should.eql(['./content/a.js']);
    });

    it('should echo string as src with base', function () {
      pathifySrc({src: './content/a.js'}, '/absolute/path/').should.eql('/absolute/path/content/a.js');
    });

    it('should echo array as src with base', function () {
      pathifySrc({src: ['./content/a.js']}, '/absolute/path/').should.eql(['/absolute/path/content/a.js']);
    });

    it('should default to src when no options', function () {
      pathifySrc({src: './content/a.js', minSrc: './content/a.min.js'}).should.eql('./content/a.js');
    });

    it('should use minSrc when no src', function () {
      pathifySrc({minSrc: './content/a.min.js'}).should.eql('./content/a.min.js');
    });

    it('should use src when useMin=false', function () {
      pathifySrc({
        src: './content/a.js',
        minSrc: './content/a.min.js'
      }, null, {useMin: false}).should.eql('./content/a.js');
    });

    it('should use minSrc when useMin=true', function () {
      pathifySrc({
        src: './content/a.js',
        minSrc: './content/a.min.js'
      }, null, {useMin: true}).should.eql('./content/a.min.js');
    });

    it('should use minSrc when NODE_ENV=production', function () {
      pathifySrc({
          src: './content/a.js',
          minSrc: './content/a.min.js'
        },
        null,
        {useMin: 'production'},
        'production').should.eql('./content/a.min.js');
    });

    it('should use src when NODE_ENV=NULL and useMin is "production"', function () {
      pathifySrc({
          src: './content/a.js',
          minSrc: './content/a.min.js'
        },
        null,
        {useMin: 'production'},
        'dev').should.eql('./content/a.js');
    });

    it('should use minSrc when NODE_ENV=production and useMin is ["production", "staging"]', function () {
      pathifySrc({
          src: './content/a.js',
          minSrc: './content/a.min.js'
        },
        null,
        {useMin: ['production', 'staging']},
        'production').should.eql('./content/a.min.js');
    });

    it('should use src when NODE_ENV=dev and useMin is ["production", "staging"]', function () {
      pathifySrc({
          src: './content/a.js',
          minSrc: './content/a.min.js'
        },
        null,
        {useMin: ['production', 'staging']},
        'dev').should.eql('./content/a.js');
    });

    it('should use src when NODE_ENV=dev and useMin is "production"', function () {
      pathifySrc({
          src: './content/a.js',
          minSrc: './content/a.min.js'
        },
        null,
        {useMin: 'production'},
        'dev').should.eql('./content/a.js');
    });

    it('should use srcs from array of objs', function () {
      pathifySrc([
        {src: './content/a.js', minSrc: './content/a.min.js'},
        {src: './content/b.js', minSrc: './content/b.min.js'}
      ]).should.eql(['./content/a.js', './content/b.js']);
    });

    it('should use minSrcs from array of objs', function () {
      pathifySrc([
          {src: './content/a.js', minSrc: './content/a.min.js'},
          {src: './content/b.js', minSrc: './content/b.min.js'}
        ],
        null,
        {useMin: true}).should.eql(['./content/a.min.js', './content/b.min.js']);
    });

    it('should use minSrcs from array of objs when NODE_ENV=production and useMin=production', function () {
      pathifySrc([
          {src: './content/a.js', minSrc: './content/a.min.js'},
          {src: './content/b.js', minSrc: './content/b.min.js'}
        ],
        null,
        {useMin: 'production'},
        'production').should.eql(['./content/a.min.js', './content/b.min.js']);
    });

    it('should use srcs from array of objs when NODE_ENV=dev and useMin=production', function () {
      pathifySrc([
          {src: './content/a.js', minSrc: './content/a.min.js'},
          {src: './content/b.js', minSrc: './content/b.min.js'}
        ],
        null,
        {useMin: 'production'},
        'dev').should.eql(['./content/a.js', './content/b.js']);
    });

    it('should use minSrc from array of objs if defined', function () {
      pathifySrc([
          {src: './content/a.js'},
          {src: './content/b.js', minSrc: './content/b.min.js'}
        ],
        null,
        {useMin: true},
        '').should.eql(['./content/a.js', './content/b.min.js']);
    });

    it('should use minSrc from array of objs if defined and NODE_ENV=production and useMin=production', function () {
      pathifySrc([
          {src: './content/a.js'},
          {src: './content/b.js', minSrc: './content/b.min.js'}
        ],
        null,
        {useMin: 'production'},
        'production').should.eql(['./content/a.js', './content/b.min.js']);
    });

    it('should use minSrc from array of objs if defined and NODE_ENV=production and useMin=["production"]', function () {
      pathifySrc([
          {src: './content/a.js'},
          {src: './content/b.js', minSrc: './content/b.min.js'}
        ],
        null,
        {useMin: ['production']},
        'production').should.eql(['./content/a.js', './content/b.min.js']);
    });
  });

  describe('should error', function () {

    var errorMsgRegex = /^Config parse error\. Invalid bundle glob detected\. Expected string, array or object but got/,
      errorMsgNeitherRegex = /^Config parse error\. Invalid bundle glob detected\. Neither src nor minSrc defined/,
      errorMsgUseMinFalseRegex = /^Config parse error\. useMin=false but no src defined/;

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

    it('when neither src nor minSrc is defined', function () {
      (function () {
        pathifySrc({});
      }).should.throw(errorMsgNeitherRegex);
    });

    it('when no src and useMin=false', function () {
      (function () {
        pathifySrc({}, null, {useMin: false});
      }).should.throw(errorMsgUseMinFalseRegex);
    });

  });


  afterEach(function () {
    process.env.NODE_ENV = '';
  });

});
