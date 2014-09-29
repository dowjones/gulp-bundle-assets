var gulp = require('gulp'),
  rimraf = require('gulp-rimraf'),
  livereload = require('gulp-livereload'),
  path = require('path'),
  gbundle = require('../../index');

process.env.NODE_ENV = 'production'; // hardcode to always run in production mode

gulp.task('bundle', ['clean'], function () {
  return gulp.src('./bundle.config.js')
    .pipe(gbundle({
      //bundleAllEnvironments: true,
      //quietMode: true
    }))
    .pipe(gbundle.results({
      dest: './',
      pathPrefix: '/public/'
    }))
    .pipe(gulp.dest('./public'));
});

gulp.task('watch', function () {
  var livereloadServer = livereload();
  livereload.listen();
  gulp.watch(['./public/*.*']).on('change', function (file) {
    livereloadServer.changed(file.path);
  });
  gbundle.watch({
    //bundleAllEnvironments: true,
    //quietMode: true,
    configPath: path.join(__dirname, 'bundle.config.js'),
    results: {
      dest: __dirname,
      pathPrefix: '/public/'
    },
    dest: path.join(__dirname, 'public')
  });
});

gulp.task('clean', function () {
  return gulp.src('./public', { read: false })
    .pipe(rimraf());
});
