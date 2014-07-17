var BundleType = require('./model/bundle-type');
var bundleToHtml = {};

bundleToHtml[BundleType.SCRIPTS] = function (path) {
  return "<script type='text/javascript' src='" + path + "'></script>";
};

bundleToHtml[BundleType.STYLES] = function (path) {
  return "<link rel='stylesheet' href='" + path + "' />";
};

module.exports = bundleToHtml;