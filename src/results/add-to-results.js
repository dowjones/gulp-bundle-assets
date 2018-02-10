var path = require('path');

/**
 * add bundle defined in file.bundle to obj
 * @param {Object} obj
 * @param {File} file
 * @param {string} pathPrefix
 */
module.exports = function(obj, file, pathPrefix, fileName) {
  if (file.bundle) {
    var env = file.bundle.env && file.bundle.bundleAllEnvironments ? file.bundle.env : '';
    var envKey = (env || 'default') + '_normal';
    var outputFilePostfix = (env ? '.' + env : '') + '.json';
    obj[envKey] = obj[envKey] || {
      filename: fileName + outputFilePostfix,
      contents: {}
    };
    obj[envKey].contents[file.bundle.name] = obj[envKey].contents[file.bundle.name] || {};
    obj[envKey].contents[file.bundle.name][file.bundle.type] = path.join(pathPrefix, file.relative).replace(/\\/g, '/');
  }
  return obj;
};
