var should = require('should');
module.exports = {
  errorUnexpectedFileInStream: function (file) {
    throw new Error('Unexpected file in stream ' + file.relative);
  },
  getCssSrcMapLine: function(fileName) {
    /*# sourceMappingURL=maps/main.css.map */
    return '/*# sourceMappingURL=maps/' + fileName + '.map */';
  },
  getJsSrcMapLine: function(fileName) {
    //# sourceMappingURL=maps/main.js.map
    return '//# sourceMappingURL=maps/' + fileName + '.map';
  }
};