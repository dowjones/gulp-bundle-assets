/// <reference types="node"/>
var through = require('through2'),
  PluginError = require('plugin-error'),
  colors = require('ansi-colors'),
  cache = require('./service/cache'),
  logger = require('./service/logger'),
  readableStream = require('readable-stream'),
  duplexer = require('duplexer2'),
  mergeStream = require('merge-stream'),
  streamBundles = require('./stream-bundles'),
  results = require('./results'),
  ConfigModel = require('./model/config');

var gulpBundleAssets = function (options: object) {
  options = options || {};

  var writable = new readableStream.Writable({objectMode: true});
  var readable = through.obj(function (file, enc, cb) { // noop
    this.push(file);
    cb();
  });

  writable._write = function _write(file, encoding, done) {

    var config;

    if (file.isNull()) {
      this.push(file);
      return done();
    }

    if (file.isStream()) {
      this.emit('error', new PluginError('gulp-bundle-assets', 'Streaming not supported'));
      return done();
    }

    try {
      config = new ConfigModel(file, options);
    } catch (e) {
      logger.log(colors.red('Failed to parse config file:'), colors.red(file.path));
      logger.log(e);
      this.emit('error', new PluginError('gulp-bundle-assets', e));
      return done();
    }

    cache.set('config', config);

    mergeStream.apply(mergeStream, streamBundles(config))
      .pipe(readable);
    return done();
  };

  return duplexer(writable, readable);
};

gulpBundleAssets.results = results;

module.exports = gulpBundleAssets;