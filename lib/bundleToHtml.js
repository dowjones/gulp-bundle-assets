var BundleType = require('./BundleType');
var bundleToHtml = {};

bundleToHtml[BundleType.JS] = function (path) {
  return "<script type='text/javascript' src='" + path + "'></script>";
};

bundleToHtml[BundleType.CSS] = function (path) {
  return "<link rel='stylesheet' href='" + path + "' />"
};

module.exports = bundleToHtml;