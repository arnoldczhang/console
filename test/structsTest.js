var chai = require('chai');
var colors = require('colors');
var libs = require('./libs.js');
var expect = chai.expect;

describe('structs', function () {

    var Collection = Structs.Collection;
    var List = Structs.List;

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

    it('length', function (done) {
        var col = Collection(1,2,3);
        var col2 = Collection([1,2,3]);
        var col3 = Collection([1]);
        var col4 = Collection(1);
        expect(col.size).to.be.equal(3);
        expect(col2.size).to.be.equal(3);
        expect(col3.size).to.be.equal(1);
        expect(col4.size).to.be.equal(1);

        var list = List([1,2,{a: 1}, 3,,4]);
        var list2 = List([1,2,{a: 1}, 3,,4]);
        expect(list.equals(list2)).to.be.true;

        var simple = List(1,2,3);
        list = List([1, simple,3,4,,{a:1}]);
        list2 = List([1, simple,3,4,,{a:1}]);
        expect(list.equals(list2)).to.be.true;
        done();
    });
});








