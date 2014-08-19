'use strict';
var libPath = './../../../lib',
  ConfigModel = require(libPath + '/model/config'),
  should = require('should'),
  File = require('vinyl');

describe('config', function () {

  it('should create object with defaults', function () {
    var configModel = new ConfigModel({
      bundle: {},
      copy: {}
    });
    configModel.bundle.should.eql({});
    configModel.copy.should.eql({});
    configModel.options.base.should.eql('.');
  });

  it('should create object given basic config', function () {
    var config = {
      bundle: {
        vendor: { scripts: "./lib/*.js", styles: "./**/*.css" }
      }, copy: {
        src: "./font/*.*"
      }
    };
    var configModel = new ConfigModel(config);
    configModel.bundle.should.eql(config.bundle);
    configModel.copy.should.eql(config.copy);
    configModel.options.base.should.eql('.');
  });

  it('should create object given basic config and options', function () {

    var opts = {
      base: '/test/'
    };
    var configModel = new ConfigModel({ bundle: {}, copy: {} }, opts);
    configModel.bundle.should.eql({});
    configModel.copy.should.eql({});
    configModel.options.base.should.eql('/test/');
  });

  describe('should get all minSrcs', function () {

    it('when given complex config', function () {
      var config = {
        bundle: {
          header: {
            scripts: [
              './js/header-scripts.js',
              {
                src: './bower_components/bootstrap/dist/css/bootstrap.css',
                minSrc: './bower_components/bootstrap/dist/css/bootstrap.min.css'
              }
            ],
            styles: {
              src: './bower_components/bootstrap/dist/css/bootstrap.css',
              minSrc: './bower_components/bootstrap/dist/css/bootstrap.min.css'
            }
          },
          vendor: {
            scripts: [
              {src: './bower_components/angular/angular.js', minSrc: './bower_components/angular/angular.min.js'},
              {src: './bower_components/boostrap/boostrap.js'},
              './bower_components/spin/spin.js'
            ]
          },
          main: {
            styles: [
              {
                src: './bower_components/bootstrap/dist/css/bootstrap.css',
                minSrc: './bower_components/bootstrap/dist/css/bootstrap.min.css'
              }
            ]
          }
        }
      };
      var opts = {
        base: '/test/'
      };
      var configModel = new ConfigModel(config, opts);
      configModel.bundle.should.eql(config.bundle);
      configModel.getAllMinSrcs().should.eql({
        header: {
          scripts: [
            {
              src: './bower_components/bootstrap/dist/css/bootstrap.css',
              minSrc: './bower_components/bootstrap/dist/css/bootstrap.min.css'
            }
          ],
          styles: [
            {
              src: './bower_components/bootstrap/dist/css/bootstrap.css',
              minSrc: './bower_components/bootstrap/dist/css/bootstrap.min.css'
            }
          ]
        },
        vendor: {
          scripts: [
            {
              src: './bower_components/angular/angular.js',
              minSrc: './bower_components/angular/angular.min.js'
            }
          ]
        },
        main: {
          styles: [
            {
              src: './bower_components/bootstrap/dist/css/bootstrap.css',
              minSrc: './bower_components/bootstrap/dist/css/bootstrap.min.css'
            }
          ]
        }
      });
    });

  });

  describe('should get all environments', function () {

    it('when given complex config', function () {

      var config = new ConfigModel({
        bundle: {
          vendor: {
            scripts: [
              {src: './bower_components/jquery/jquery.js', minSrc: './bower_components/jquery/jquery.min.js'},
              './bower_components/spin/spin.js'
            ],
            styles: {
              src: './bower_components/bootstrap/dist/css/bootstrap.css',
              minSrc: './bower_components/bootstrap/dist/css/bootstrap.min.css'
            },
            options: {
              useMin: ['production', 'staging'],
              uglify: false,
              rev: true
            }
          },
          article: {
            scripts: './lib/article/**/*.js',
            styles: './lib/article/**/*.less',
            options: {
              uglify: 'production',
              rev: ['production', 'staging']
            }
          },
          main: {
            scripts: [
              './js/controllers.js'
            ],
            styles: [
              './styles/**/*.css'
            ],
            options: {
              uglify: ['production', 'staging', 'sat'],
              rev: 'development'
            }
          }
        },
        copy: [
          {
            src: './bower_components/bootstrap/dist/fonts/**/*.*',
            base: './bower_components/bootstrap/dist/'
          },
          './images/**/*.*'
        ]
      });

      config.getAllEnvironments().should.eql(['production', 'staging', 'sat', 'development']);
    });


    it('when given config with no env', function () {
      var config = new ConfigModel({
        bundle: {
          main: {
            scripts: '*.js'
          },
          options: {
            uglify: false,
            rev: true
          }
        }
      });
      config.getAllEnvironments().should.eql([]);
    });

  });

  describe('should throw error', function () {

    it('when no file or config given', function () {
      (function () {
        new ConfigModel();
      }).should.throw(/^Configuration file should be in the form "{ bundle: {}, copy: {} }"/);
    });

    it('when no bundle or copy property provided', function () {
      (function () {
        new ConfigModel({ junk: {} });
      }).should.throw(/^Configuration file should be in the form "{ bundle: {}, copy: {} }"/);
    });

    // todo more test cases for verifying config

  });

});
