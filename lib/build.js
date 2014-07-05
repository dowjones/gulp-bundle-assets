var _ = require('lodash'),
  merge = require('merge-stream'),
  gutil = require('gulp-util'),
  fs = require('fs'),
  path = require('path'),
  gulp = require('gulp'),
  concat = require('gulp-concat'),
  using = require('gulp-using');

function bundle(config) {
  var streams = [];

  _.forOwn(config.bundle, function (bundle, key) {

    if (bundle.scripts) {
      streams.push(gulp.src(bundle.scripts, {base: '.'})
        .pipe(concat(key + '-bundle.js'))
        .pipe(gulp.dest(config.dest)));

      // dev mode
      /*streams.push(gulp.src(bundle.scripts, {base: '.'})
        .pipe(using(key))
        .on('end', function () {
          // todo why is end called twice??
          console.log('DONE!');

          mkdirp(path.join(config.configPath, '.built'), function (err) { // todo diff path from /public?
            if (err) throw err;

            fs.writeFile(path.join(config.configPath, '.built/bundles.json'), JSON.stringify(bundleList, null, 2), function (err) {
              if (err) throw err;
              console.log('It\'s saved!');
            });

          });


        })
        .pipe(gulp.dest(config.dest)));*/
    }

    if (bundle.styles) {
      streams.push(gulp.src(bundle.styles, {base: '.'})
        .pipe(concat(key + '-bundle.css'))
        .pipe(gulp.dest(config.dest)));

      // dev mode
      /*streams.push(gulp.src(bundle.styles, {base: '.'})
        .pipe(gulp.dest(config.dest)));*/
    }

    if (bundle.resources) {
      streams.push(gulp.src(bundle.resources, {base: './lib'}) //todo what should base be?
        .pipe(gulp.dest(config.dest)));
    }

  });

  return merge.apply(merge, streams);
}

module.exports = function () {
  var config = require(path.join(process.cwd(), 'bundle.config.js'));
  return bundle(config);
};