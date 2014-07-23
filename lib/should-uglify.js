var util = require('util');
var contains = require('lodash').contains;
module.exports = function(opt) {
  if (typeof opt === 'undefined') {
    return true;
  } else if (util.isArray(opt)) {
    return contains(opt, process.env.NODE_ENV);
  } else if (typeof opt === 'string') {
    return opt === process.env.NODE_ENV;
  }
  return !!opt;
};