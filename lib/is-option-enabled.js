var util = require('util');
var contains = require('lodash').contains;
module.exports = function(opt) {
  if (typeof opt === 'undefined') {
    return true;
  }
  return !!opt;
};