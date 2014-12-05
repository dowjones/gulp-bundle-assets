var gulp = require('gulp'),
  rimraf = require('gulp-rimraf'),
  path = require('path'),
  bundle = require('../../index');

gulp.task('bundle', ['clean'], function () {
  return gulp.src('./bundle.config.js')
    .pipe(bundle())
    .pipe(bundle.results({
      dest: './',
      pathPrefix: '/public/'
    }))
    .pipe(gulp.dest('./public'));
});

gulp.task('clean', function () {
  return gulp.src('./public', { read: false })
    .pipe(rimraf());
});

gulp.task('watch', function () {
  bundle.watch({
    configPath: path.join(__dirname, 'bundle.config.js'),
    results: {
      dest: __dirname,
      pathPrefix: '/public/',
      fileName: 'manifest'
    },
    dest: path.join(__dirname, 'public')
  });
});