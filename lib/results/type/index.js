var gutil = require('gulp-util'),
  fs = require('fs'),
  path = require('path'),
  warnPrefix = gutil.colors.bgYellow.black('WARN');

module.exports = function(file, pathPrefix) {
  var bundleType = file.bundle.type;
  var resulter = loadResulter(file.bundle.result.type, bundleType);
  var bundlePath = (pathPrefix) ? pathPrefix + file.relative : file.relative;
  return resulter(bundlePath);
};

/**
 *
 * @param {string|Object} resulter
 * @param bundleType
 */
function loadResulter(resulter, bundleType) {
  if (typeof resulter === 'function') {
    return resulter;
  }
  if (typeof resulter === 'object') {
    return loadResulter(resulter[bundleType], bundleType);
  }
  if (typeof resulter === 'string') {
    var resulterPath = path.join(__dirname + '/' + bundleType + '-' + resulter + '.js');
    try {
      return loadResulter(require(resulterPath), bundleType);
    } catch(e) {
      var defaultResulterPath = path.join(__dirname + '/' + bundleType + '-html.js');
      gutil.log("\n" +
      warnPrefix + " Failed to load result writer: " + resulterPath + "\n" +
        warnPrefix + " using default instead: " + defaultResulterPath);
      return loadResulter(require(defaultResulterPath), bundleType);
    }
  }
  throw new Error('Failed to load result function "' + resulter + '" for type "' + bundleType + '"');
}