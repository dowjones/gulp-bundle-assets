var bundleToHtml = require('./bundle-to-html');

/**
 * add bundle defined in file.bundle to obj
 * @param {Object} obj
 * @param {File} file
 * @param {string} pathPrefix
 */
module.exports = function(obj, file, pathPrefix) {
  if (file.bundle) {
    var env = file.bundle.env && file.bundle.bundleAllEnvironments ? file.bundle.env : '';
    var envKey = env || 'default';
    var bundleResultFileName = 'bundle.result' + (env ? '.' + env : '') + '.json';
    obj[envKey] = obj[envKey] || {
      filename: bundleResultFileName,
      contents: {}
    };
    obj[envKey].contents[file.bundle.name] = obj[envKey].contents[file.bundle.name] || {};
    obj[envKey].contents[file.bundle.name][file.bundle.type] =
      bundleToHtml[file.bundle.type](file.relative, pathPrefix); // todo support more than just html results
  }
  return obj;
};