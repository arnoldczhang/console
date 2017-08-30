var chai = require('chai');
var colors = require('colors');
var curry = require('../js/curry');
var expect = chai.expect;

describe('curry', function () {
    before(function() {
      // 在本区块的所有测试用例之前执行
    });

    after(function() {
      // 在本区块的所有测试用例之后执行
    });

    beforeEach(function() {
      // 在本区块的每个测试用例之前执行
    });

    afterEach(function() {
      // 在本区块的每个测试用例之后执行
    });

    it('ajax', function (done) {
      function ajax (params) {
        return params;
      };

      var ajaxCurry = curry(ajax, 3);
      expect(ajaxCurry({a: 1})).to.be.deep.equal(undefined);
      expect(ajaxCurry({b: 2})).to.be.deep.equal(undefined);
      expect(ajaxCurry({c: 3})).to.be.deep.equal({a: 1, b: 2, c: 3});

      ajaxCurry = curry(ajax, 3);
      expect(ajaxCurry({a: 1})).to.be.deep.equal(undefined);
      expect(ajaxCurry({b: 2})).to.be.deep.equal(undefined);
      expect(ajaxCurry({b: 3})).to.be.deep.equal(undefined);
      expect(ajaxCurry({b: 13})).to.be.deep.equal(undefined);
      expect(ajaxCurry({b: 23})).to.be.deep.equal(undefined);
      expect(ajaxCurry({c: 3})).to.be.deep.equal({a: 1, b: 23, c: 3});

      ajaxCurry = curry(ajax, 3, ['a', 'b', 'c']);
      expect(ajaxCurry({a: 1})).to.be.deep.equal(undefined);
      expect(ajaxCurry({b: 3})).to.be.deep.equal(undefined);
      expect(ajaxCurry({b: 13})).to.be.deep.equal(undefined);
      expect(ajaxCurry({d: 23})).to.be.deep.equal(undefined);
      expect(ajaxCurry({e: 133})).to.be.deep.equal(undefined);
      expect(ajaxCurry({c: 3})).to.be.deep.equal({a: 1, b: 13, c: 3, d: 23, e: 133});

      done();
    });
});
