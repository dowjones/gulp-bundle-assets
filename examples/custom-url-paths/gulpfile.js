var path = require('path'),
  gulp = require('gulp'),
  gbundle = require('../../index'),
  resultsConfig = {
    dest: __dirname,
    pathPrefix: '/assets/',
    fileName: 'manifest'
  },
  destPath = path.join(__dirname, 'public');

gulp.task('bundle', function () {
  return gulp.src('./bundle.config.js')
    .pipe(gbundle())
    .pipe(gbundle.results(resultsConfig))
    .pipe(gulp.dest(destPath));
});

gulp.task('watch', function () {
  gbundle.watch({
    configPath: path.join(__dirname, 'bundle.config.js'),
    results: resultsConfig,
    dest: destPath
  });
});
