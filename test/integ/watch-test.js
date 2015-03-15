var bundler = require('../../index');
var gulp = require('gulp');
var path = require('path');
var bluebird = require('bluebird');
var fs = bluebird.promisifyAll(require('graceful-fs'));
var glob = bluebird.promisify(require('glob'));

// todo increase test timeout times

describe('integration watch tests', function () {

  it('should rebuild scripts on change', function (done) {

    // todo clean directory

    var projectDir = path.join(__dirname, '../fixtures/watch/'),
      resultJsFile;

    bundler.watch({
      configPath: path.join(projectDir, 'bundle.config.js'),
      dest: path.join(projectDir, 'public')
    });

    glob(path.join(projectDir, 'public/*.js'))
      .then(function (files) {

        //todo assert only 1

        resultJsFile = files[0];

        return fs.readFileAsync(resultJsFile, 'utf8');
      })
      .then(function (data) {

        //todo assert expected content

        var newContent = 'console.log("page-NEW")';
        return fs.writeFileAsync(path.join(projectDir, 'content/scripts/cool.coffee'), newContent)
      })
      .then(function() {
        // todo wait for bundler to pick up watch... (perhaps delete previous file and wait on file to exist again?)

        return fs.readFileAsync(resultJsFile, 'utf8');
      })
      .then(function (data) {

        //todo assert expected content

        done();
      });

  });

  /*it('should not rebuild scripts on change when transform error occurs', function (done) {

  });

  it('should rebuild styles on change', function (done) {

  });

  it('should not rebuild styles on change when transform error occurs', function (done) {

  });*/

});