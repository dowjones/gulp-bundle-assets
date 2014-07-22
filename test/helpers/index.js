var should = require('should');
module.exports = {
  errorUnexpectedFileInStream: function (file) {
    throw new Error('Unexpected file in stream ' + file.relative);
  },
  assertStringStartsWithSourceMapJs: function (str) {
    (str.indexOf('//# sourceMappingURL=data:application/json;base64') === 0).should.be.ok;
  },
  assertStringStartsWithSourceMapCss: function (str) {
    (str.indexOf('/*# sourceMappingURL=data:application/json;base64') === 0).should.be.ok;
  }
};