module.exports = function(opt) {
  if (typeof opt === 'undefined') {
    return true;
  }
  return !!opt;
};