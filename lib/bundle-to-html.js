var BundleType = require('./model/bundle-type');
var bundleToHtml = {};

bundleToHtml[BundleType.SCRIPTS] = function (path, pathPrefix) {
  if (pathPrefix) {
    path = pathPrefix + path;
  }
  return "<script src='" + path + "' type='text/javascript'></script>";
};

bundleToHtml[BundleType.STYLES] = function (path, pathPrefix) {
  if (pathPrefix) {
    path = pathPrefix + path;
  }
  return "<link href='" + path + "' media='screen' rel='stylesheet' type='text/css'/>";
};

module.exports = bundleToHtml;