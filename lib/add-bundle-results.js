var bundleToHtml = require('./bundle-to-html');

/**
 * add bundle defined in file.bundle to obj
 * @param {Object} obj
 * @param {File} file
 * @param {string} pathPrefix
 */
module.exports = function(obj, file, pathPrefix) {
  if (file.bundle) {
    obj[file.bundle.name] = obj[file.bundle.name] || {};
    obj[file.bundle.name][file.bundle.type] =
      bundleToHtml[file.bundle.type](file.relative, pathPrefix); // todo support more than just html results
  }
  return obj;
};