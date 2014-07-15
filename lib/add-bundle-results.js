var bundleToHtml = require('./bundle-to-html');

/**
 * add bundle defined in file.bundle to obj
 * @param {Object} obj
 * @param {File} file
 */
module.exports = function(obj, file) {
  if (file.bundle) {
    obj[file.bundle.name] = obj[file.bundle.name] || {};
    obj[file.bundle.name][file.bundle.type] =
      bundleToHtml[file.bundle.type](file.relative); // todo support more than just html results
  }
  return obj;
};