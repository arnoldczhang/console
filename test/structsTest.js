var chai = require('chai');
var colors = require('colors');
var libs = require('./libs.js');
var expect = chai.expect;

describe('structs', function () {

    var Collection = Structs.Collection;
    var List = Structs.List;
    var Map = Structs.Map;

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
        var col = Collection([1,2,3]);
        var col2 = Collection([1,2,3]);
        var col3 = Collection([1]);
        var col4 = Collection([1]);
        expect(col.size).to.be.equal(3);
        expect(col2.size).to.be.equal(3);
        expect(col3.size).to.be.equal(1);
        expect(col4.size).to.be.equal(1);

        var list = List([1,2,{a: 1}, 3,,4]);
        var list2 = list.set(1, 2);
        expect(list === list2).to.be.true;
        expect(list.equals(list2)).to.be.true;

        var list = List([1,2,{a: 1}, 3,,4]);
        var list2 = List([1,2,{a: 1}, 3,,4]);
        expect(list.equals(list2)).to.be.true;

        var simple = List([1,2,3]);
        list = List([1, simple,3,4,,{a:1}]);
        list2 = List([1, simple,3,4,,{a:1}]);
        expect(list.equals(list2)).to.be.true;

        var list = List([1,2, [1]]);
        expect(list.includes([1])).to.be.false;
        var li = List([1,2,3]);
        var list = List([li, 2, 3, 4]);
        expect(list.includes(li)).to.be.true;

        var list = List([1,2,3,4]);
        expect(list.reduce(function (a,b) {
            return a + b + this.a;
        }, 100, {
            a: 100
        })).to.be.equal(510);

        var li = List([3]);
        var list = List([1, 2, li]);
        expect(list.first()).to.be.equal(1);
        expect(list.last()).to.be.equal(li);

        var list = List([1,2, [1]]);
        var list2 = list.update(1, function (ch) {
            return ch * 100;
        });
        expect(list2.get(1)).to.be.equal(200);
        var list2 = list.update(function (ch) {
            return ch.get(2);
        });
        expect(list2).to.be.deep.equal([1]);

        var list2 = list.update(1, 'aaa', function (ch) {
        });
        expect(list2.get(1)).to.be.equal('aaa');

        expect(Collection({})).to.be.deep.equal(Collection({}));
        expect(Collection([])).to.be.deep.equal(Collection([]));

        expect(function () {
            List({});
        }).to.throw('args[0] is not type of array');

        expect(List([])).to.be.deep.equal(List([]));

        expect(function () {
            Map([]);
        }).to.throw('args[0] is not type of object');

        expect(Map({})).to.be.deep.equal(Map({}));

        done();
    });
});








