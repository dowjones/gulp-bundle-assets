var libPath = './../../lib',
  deepPluck = require(libPath + '/deep-pluck'),
  should = require('should');

describe('deep-pluck', function () {

  it('should find deeply nested key', function () {
    deepPluck.call({ 'a': 1, 'b': 2, 'c': {'d': {'e': 7}}}, 'd')
      .should.eql([
        {'e': 7}
      ]);
  });

  it('should find deeply nested key with primitive value', function () {
    deepPluck.call({ 'a': 1, 'b': 2, 'c': {'d': {'e': 7}}}, 'e')
      .should.eql([7]);
  });

  it('should find multiple occurrences of deeply nested key', function () {
    deepPluck.call({
      'aa': 1,
      'bb': 2,
      'cc': {
        'd': {
          'x': 9
        }
      },
      ddd: {
        dd: {
          d: {
            y: 9
          }
        }
      }
    }, 'd')
      .should.eql([
        {'x': 9},
        {'y': 9}
      ]);
  });

  it('should find deeply nested key inside array', function () {
    deepPluck.call({ 'a': 1, 'b': 2, 'c': [
      {'d': {'e': 7}}
    ]}, 'd')
      .should.eql([
        {'e': 7}
      ]);
  });

  it('should return empty array if not found', function () {
    deepPluck.call({ 'a': 1, 'b': 2, 'c': {'d': {'e': 7}}}, 'f')
      .should.eql([]);
  });

});
