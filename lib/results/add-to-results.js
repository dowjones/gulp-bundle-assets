var toResultType = require('./type'),
  _ = require('lodash');

/**
 * add bundle defined in file.bundle to obj
 * @param {Object} obj
 * @param {File} file
 * @param {string} pathPrefix
 */
module.exports = function(obj, file, pathPrefix, fileName, rawFile, rawPathPrefix, sortUnprocessedOutput) {
  if (file.bundle) {
    var env = file.bundle.env && file.bundle.bundleAllEnvironments ? file.bundle.env : '';
    var envKey = (env || 'default') + '_normal';
    var outputFilePostfix = (env ? '.' + env : '') + '.json';
    obj[envKey] = obj[envKey] || {
      filename: fileName + outputFilePostfix,
      contents: {}
    };
    obj[envKey].contents[file.bundle.name] = obj[envKey].contents[file.bundle.name] || {};
    obj[envKey].contents[file.bundle.name][file.bundle.type] = toResultType(file, pathPrefix + file.relative);
    if (rawFile && file.bundle.srcFiles) {
      var rawKey = (env || 'default') + '_raw';
      obj[rawKey] = obj[rawKey] || {
        filename: rawFile + outputFilePostfix,
        contents: {}
      };
      obj[rawKey].contents[file.bundle.name] = obj[rawKey].contents[file.bundle.name] || {};
      obj[rawKey].contents[file.bundle.name][file.bundle.type] = _.map(file.bundle.srcFiles, function (filePath) {
        return toResultType(file, rawPathPrefix + filePath);
      });
      if (sortUnprocessedOutput) {
        obj[rawKey].contents[file.bundle.name][file.bundle.type].sort();
      }
    }
  }
  return obj;
};
