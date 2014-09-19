var gutil = require('gulp-util'),
  warnPrefix = gutil.colors.bgYellow.black('WARN');

module.exports = function (file, enc, cb) {
  if (!file.isStream() && // ignore streams (e.g. browserify) this those will implement their own sourcemaps
    (!file.sourceMap || !file.sourceMap.sources || !file.sourceMap.sources.length)) {
    // only log error in case user doesn't care about source maps.
    // often this will result with an error later on in the pipe anyways.
    gutil.log("\n" +
      warnPrefix + " Source map is empty for file '" + gutil.colors.magenta(file.relative) + "'.\n" +
      warnPrefix + " This is most likely not a problem with '" + gutil.colors.cyan('gulp-bundle-assets') + "' itself.\n" +
      warnPrefix + " This usually happens when a file passing through the stream is invalid or malformed\n" +
      warnPrefix + " or if you have a misbehaving custom transform.\n");
  }
  this.push(file);
  cb();
};