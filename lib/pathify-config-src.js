var path = require('path'),
  util = require('util'),
  _ = require('lodash'),
  ERROR_MSG_PREFIX = 'Config parse error. ';

function stringSrc(src, base) {
  if (base && base !== '.') {
    return path.join(base, src);
  }
  return src;
}

function arraySrc(src, base, options) {
  for (var i = 0; i < src.length; i++) {
    if (typeof src[i] === 'string') {
      src[i] = stringSrc(src[i], base);
    } else {
      throw new Error(ERROR_MSG_PREFIX + 'Invalid bundle path detected. Expected string but got ' + src);
    }
  }
  return src;
}

/**
 * Converts a config value of src glob(s) to a result that gulp can understand
 * https://github.com/wearefractal/vinyl-fs/blob/master/lib/src/index.js#L41
 *
 * @param {String|Array} src
 * @param {String} base
 * @param {Object} options
 * @returns {String|Array}
 */
module.exports = function (src, base, options) {
  var srcCopy = _.cloneDeep(src); // this func mutates src so make a copy first
  if (typeof srcCopy === 'string') return stringSrc(srcCopy, base);
  else if (util.isArray(srcCopy)) return arraySrc(srcCopy, base, options);
  throw new Error(ERROR_MSG_PREFIX + 'Invalid bundle path detected. Expected string or array but got ' + srcCopy);
};
