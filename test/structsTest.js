var chai = require('chai');
var colors = require('colors');
var Structs = require('../js/structs');
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
        var col2 = Collection([1]);
        expect(col.size).to.be.equal(3);
        expect(col2.size).to.be.equal(1);

        var col = Collection({a: [1,2,3], b: 2, c: 3});
        var col2 = Collection({a: 2});
        expect(col.size).to.be.equal(3);
        expect(List(col.get('a')).size).to.be.equal(3);
        expect(col2.size).to.be.equal(1);

        var list = List([1,2,3]);
        var list2 = List([1]);
        expect(list.size).to.be.equal(3);
        expect(list2.size).to.be.equal(1);

        var map = Map({a: [1,2,3], b: 2, c: 3});
        var map2 = Map({a: 2});
        expect(map.size).to.be.equal(3);
        expect(List(map.get('a')).size).to.be.equal(3);
        expect(map2.size).to.be.equal(1);
        done();
    });


    it('get(In)', function (done) {
        var col = Collection({a: 1, b: 2, c: List([1,Map({aa: 10}),3])});
        expect(col.get('a')).to.be.equal(1);
        expect(col.get('b')).to.be.equal(2);
        expect(col.get('c')).to.be.deep.equal(List([1,Map({aa: 10}),3]));
        expect(col.getIn(['c'])).to.be.deep.equal(List([1,Map({aa: 10}),3]));
        expect(col.getIn(['c', 1])).to.be.deep.equal(Map({aa: 10}));
        expect(col.getIn(['c', 1, 'aa'])).to.be.equal(10);

        var col = Collection([1, List([[1,2,3], List([1, Collection({a:1, b: 3, c: Map({aa: 'abc'})})])])]);
        expect(col.get('0')).to.be.equal(1);
        expect(col.get('1')).to.be.deep.equal(List([[1,2,3], List([1, Collection({a:1, b: 3, c: Map({aa: 'abc'})})])]));
        expect(col.getIn(['1', 0])).to.be.deep.equal([1,2,3]);
        expect(col.getIn(['1', 1])).to.be.deep.equal(List([1, Collection({a:1, b: 3, c: Map({aa: 'abc'})})]));
        expect(col.getIn(['1', 1, 0])).to.be.equal(1);
        expect(col.getIn(['1', 1, 1])).to.be.deep.equal(Collection({a:1, b: 3, c: Map({aa: 'abc'})}));
        expect(col.getIn(['1', 1, 1, 'c'])).to.be.deep.equal(Map({aa: 'abc'}));
        expect(col.getIn(['1', 1, 1, 'c', 'aa'])).to.be.equal('abc');

        var map = Map({a: 1, b: 2, c: List([1,Map({aa: 10}),3])});
        expect(map.get('a')).to.be.equal(1);
        expect(map.get('b')).to.be.equal(2);
        expect(map.get('c')).to.be.deep.equal(List([1,Map({aa: 10}),3]));
        expect(map.getIn(['c'])).to.be.deep.equal(List([1,Map({aa: 10}),3]));
        expect(map.getIn(['c', 1])).to.be.deep.equal(Map({aa: 10}));
        expect(map.getIn(['c', 1, 'aa'])).to.be.equal(10);

        var list = List([1, List([[1,2,3], List([1, Collection({a:1, b: 3, c: Map({aa: 'abc'})})])])]);
        expect(list.get('0')).to.be.equal(1);
        expect(list.get('1')).to.be.deep.equal(List([[1,2,3], List([1, Collection({a:1, b: 3, c: Map({aa: 'abc'})})])]));
        expect(list.getIn(['1', 0])).to.be.deep.equal([1,2,3]);
        expect(list.getIn(['1', 1])).to.be.deep.equal(List([1, Collection({a:1, b: 3, c: Map({aa: 'abc'})})]));
        expect(list.getIn(['1', 1, 0])).to.be.equal(1);
        expect(list.getIn(['1', 1, 1])).to.be.deep.equal(Collection({a:1, b: 3, c: Map({aa: 'abc'})}));
        expect(list.getIn(['1', 1, 1, 'c'])).to.be.deep.equal(Map({aa: 'abc'}));
        expect(list.getIn(['1', 1, 1, 'c', 'aa'])).to.be.equal('abc');
        done();
    });

    it('set(In)', function (done) {
        var col = Collection([1, 2, 3]);
        expect(col.set(1, 100)).to.be.deep.equal(Collection([1, 100, 3]));
        expect(col.set(5, Collection({a: 1}))).to.be.deep.equal(Collection([1, 2, 3,,,Collection({a: 1})]));

        var col = Collection({a: 1, b: 2, c: List([1,Map({aa: 10}),3])});
        expect(col.set('c', Collection([3,2,1]))).to.be.deep.equal(Collection({a: 1, b: 2, c: Collection([3,2,1])}));
        expect(col).to.be.deep.equal(Collection({a: 1, b: 2, c: List([1,Map({aa: 10}),3])}));

        var list = List([1, 2, 3]);
        expect(list.set(1, 100)).to.be.deep.equal(List([1, 100, 3]));
        expect(list.set(5, Collection({a: 1}))).to.be.deep.equal(List([1, 2, 3,,,Collection({a: 1})]));

        var map = Map({a: 1, b: 2, c: List([1,Map({aa: 10}),3])});
        expect(col.set('c', Collection([3,2,1]))).to.be.deep.equal(Map({a: 1, b: 2, c: Collection([3,2,1])}));
        expect(col).to.be.deep.equal(Map({a: 1, b: 2, c: List([1,Map({aa: 10}),3])}));

        expect(col.setIn(['c', 1, 'aa'], 10000)).to.be.deep.equal(Collection({a: 1, b: 2, c: List([1,Map({aa: 10000}),3])}));
        expect(col).to.be.deep.equal(Collection({a: 1, b: 2, c: List([1,Map({aa: 10}),3])}));

        col = Collection([1, List([[1,2,3], List([1, Collection({a:1, b: 3, c: Map({aa: 'abc'})})])])]);
        expect(col.setIn([1, 1, 1, 'c', 'aa'], 'aaabbb')).to.be.deep.equal(Collection([1, List([[1,2,3], List([1, Collection({a:1, b: 3, c: Map({aa: 'aaabbb'})})])])]));
        expect(col).to.be.deep.equal(Collection([1, List([[1,2,3], List([1, Collection({a:1, b: 3, c: Map({aa: 'abc'})})])])]));

        var list = List([1, List([[1,2,3], List([1, Collection({a:1, b: 3, c: Map({aa: 'abc'})})])])]);
        expect(list.setIn([1, 1, 1, 'c', 'aa'], 'aaabbb')).to.be.deep.equal(List([1, List([[1,2,3], List([1, Collection({a:1, b: 3, c: Map({aa: 'aaabbb'})})])])]));
        expect(list).to.be.deep.equal(List([1, List([[1,2,3], List([1, Collection({a:1, b: 3, c: Map({aa: 'abc'})})])])]));

        var map = Map({a: 1, b: 2, c: List([1,Map({aa: 10}),3])});
        expect(map.setIn(['c', 1, 'aa'], 10000)).to.be.deep.equal(Map({a: 1, b: 2, c: List([1,Map({aa: 10000}),3])}));
        expect(map).to.be.deep.equal(Map({a: 1, b: 2, c: List([1,Map({aa: 10}),3])}));

        done();
    });

    it('update(In)', function (done) {
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

        var col = Collection([1, 2, 3]);
        expect(col.update(function (collect) {
            return collect;
        })).to.be.deep.equal(Collection([1, 2, 3]));
        expect(col.update(2, function (ch) {
            return ch + 10;
        })).to.be.deep.equal(Collection([1, 2, 13]));

        var col = Collection({a: 1, b: 2, c: List([1,Map({aa: 10}),3])});
        expect(col.update('c', function (ch) {
            return Map({aaa:111});
        })).to.be.deep.equal(Collection({a: 1, b: 2, c: Map({aaa:111})}));

        var list = List([1, 2, 3]);
        expect(list.update(function (list) {
            return list;
        })).to.be.deep.equal(List([1, 2, 3]));
        expect(list.update(2, function (ch) {
            return ch + 10;
        })).to.be.deep.equal(List([1, 2, 13]));

        var map = Map({a: 1, b: 2, c: List([1,Map({aa: 10}),3])});
        expect(col.update('a', function (ch) {
            return Map({aaa:111});
        })).to.be.deep.equal(Map({a: Map({aaa:111}), b: 2, c: List([1,Map({aa: 10}),3])}));
        expect(col.update('c', function (ch) {
            return Map({aaa:111});
        })).to.be.deep.equal(Map({a: 1, b: 2, c: Map({aaa:111})}));

        var col = Collection({a: 1, b: 2, c: List([1,Map({aa: 10}),3])});
        expect(col.updateIn(['a'], function (ch) {
            return ch + 100;
        })).to.be.deep.equal(Collection({a: 101, b: 2, c: List([1,Map({aa: 10}),3])}));
        expect(col.updateIn(['b'], function (ch) {
            return ch + 100;
        })).to.be.deep.equal(Collection({a: 1, b: 102, c: List([1,Map({aa: 10}),3])}));
        expect(col.updateIn(['c'], function (ch) {
            return ch.set(0, 100);
        })).to.be.deep.equal(Collection({a: 1, b: 2, c: List([100,Map({aa: 10}),3])}));
        expect(col.updateIn(['c', 1], function (ch) {
            return ch
        })).to.be.deep.equal(Collection({a: 1, b: 2, c: List([1,Map({aa: 10}),3])}));
        expect(col.updateIn(['c', 1], function (ch) {
            return ch.set('bb', 100);
        })).to.be.deep.equal(Collection({a: 1, b: 2, c: List([1,Map({aa: 10, bb: 100}),3])}));
        expect(col.updateIn(['c', 1, 'aa'], function (ch) {
            return ch + 100;
        })).to.be.deep.equal(Collection({a: 1, b: 2, c: List([1,Map({aa: 110}),3])}));
        expect(col.update('dd', function (col) {
            return 123;
        })).to.be.deep.equal(Collection({a: 1, b: 2, c: List([1,Map({aa: 10}),3]), dd: 123}));
        expect(col.updateIn(['dd'], function (col) {
            return 123;
        })).to.be.deep.equal(Collection({a: 1, b: 2, c: List([1,Map({aa: 10}),3]), dd: 123}));

        var col = Collection([List([1,3,5]), Map({a: 1, b: 2, c: List([1,Map({aa: 10}),3])})]);
        expect(col.updateIn([0], function (ch) {
            return ch.set(0, 100);
        })).to.be.deep.equal(Collection([List([100,3,5]), Map({a: 1, b: 2, c: List([1,Map({aa: 10}),3])})]));
        expect(col.updateIn([0], function (ch) {
            return ch.set(1, 100);
        })).to.be.deep.equal(Collection([List([1,100,5]), Map({a: 1, b: 2, c: List([1,Map({aa: 10}),3])})]));
        expect(col.updateIn([0], function (ch) {
            return ch.set(2, 100);
        })).to.be.deep.equal(Collection([List([1,3,100]), Map({a: 1, b: 2, c: List([1,Map({aa: 10}),3])})]));
        expect(col.updateIn([1], function (ch) {
            return ch.setIn(['a'], 100);
        })).to.be.deep.equal(Collection([List([1,3,5]), Map({a: 100, b: 2, c: List([1,Map({aa: 10}),3])})]));
        expect(col.updateIn([1], function (ch) {
            return ch.setIn(['b'], 100);
        })).to.be.deep.equal(Collection([List([1,3,5]), Map({a: 1, b: 100, c: List([1,Map({aa: 10}),3])})]));
        expect(col.updateIn([1], function (ch) {
            return ch.setIn(['c', '0'], 100);
        })).to.be.deep.equal(Collection([List([1,3,5]), Map({a: 1, b: 2, c: List([100,Map({aa: 10}),3])})]));
        expect(col.updateIn([1], function (ch) {
            return ch.setIn(['c', 1], Collection([1,2,3]));
        })).to.be.deep.equal(Collection([List([1,3,5]), Map({a: 1, b: 2, c: List([1,Collection([1,2,3]),3])})]));
        expect(col.updateIn([1], function (ch) {
            return ch.setIn(['c', 1, 'aa'], 100);
        })).to.be.deep.equal(Collection([List([1,3,5]), Map({a: 1, b: 2, c: List([1,Map({aa: 100}),3])})]));

        var map = Map({a: 1, b: 2, c: List([1,Map({aa: 10}),3])});
        expect(map.updateIn(['a'], function (ch) {
            return ch + 100;
        })).to.be.deep.equal(Map({a: 101, b: 2, c: List([1,Map({aa: 10}),3])}));
        expect(map.updateIn(['b'], function (ch) {
            return ch + 100;
        })).to.be.deep.equal(Map({a: 1, b: 102, c: List([1,Map({aa: 10}),3])}));
        expect(map.updateIn(['c'], function (ch) {
            return ch.set(0, 100);
        })).to.be.deep.equal(Map({a: 1, b: 2, c: List([100,Map({aa: 10}),3])}));
        expect(map.updateIn(['c', 1], function (ch) {
            return ch
        })).to.be.deep.equal(Map({a: 1, b: 2, c: List([1,Map({aa: 10}),3])}));
        expect(map.updateIn(['c', 1], function (ch) {
            return ch.set('bb', 100);
        })).to.be.deep.equal(Map({a: 1, b: 2, c: List([1,Map({aa: 10, bb: 100}),3])}));
        expect(map.updateIn(['c', 1, 'aa'], function (ch) {
            return ch + 100;
        })).to.be.deep.equal(Map({a: 1, b: 2, c: List([1,Map({aa: 110}),3])}));
        expect(map.update('dd', function (col) {
            return 123;
        })).to.be.deep.equal(Map({a: 1, b: 2, c: List([1,Map({aa: 10}),3]), dd: 123}));
        expect(map.updateIn(['dd'], function (col) {
            return 123;
        })).to.be.deep.equal(Map({a: 1, b: 2, c: List([1,Map({aa: 10}),3]), dd: 123}));

        var list = List([List([1,3,5]), Map({a: 1, b: 2, c: List([1,Map({aa: 10}),3])})]);
        expect(list.updateIn([0], function (ch) {
            return ch.set(0, 100);
        })).to.be.deep.equal(List([List([100,3,5]), Map({a: 1, b: 2, c: List([1,Map({aa: 10}),3])})]));
        expect(list.updateIn([0], function (ch) {
            return ch.set(1, 100);
        })).to.be.deep.equal(List([List([1,100,5]), Map({a: 1, b: 2, c: List([1,Map({aa: 10}),3])})]));
        expect(list.updateIn([0], function (ch) {
            return ch.set(2, 100);
        })).to.be.deep.equal(List([List([1,3,100]), Map({a: 1, b: 2, c: List([1,Map({aa: 10}),3])})]));
        expect(list.updateIn([1], function (ch) {
            return ch.setIn(['a'], 100);
        })).to.be.deep.equal(List([List([1,3,5]), Map({a: 100, b: 2, c: List([1,Map({aa: 10}),3])})]));
        expect(list.updateIn([1], function (ch) {
            return ch.setIn(['b'], 100);
        })).to.be.deep.equal(List([List([1,3,5]), Map({a: 1, b: 100, c: List([1,Map({aa: 10}),3])})]));
        expect(list.updateIn([1], function (ch) {
            return ch.setIn(['c', '0'], 100);
        })).to.be.deep.equal(List([List([1,3,5]), Map({a: 1, b: 2, c: List([100,Map({aa: 10}),3])})]));
        expect(list.updateIn([1], function (ch) {
            return ch.setIn(['c', 1], Collection([1,2,3]));
        })).to.be.deep.equal(List([List([1,3,5]), Map({a: 1, b: 2, c: List([1,Collection([1,2,3]),3])})]));
        expect(list.updateIn([1], function (ch) {
            return ch.setIn(['c', 1, 'aa'], 100);
        })).to.be.deep.equal(List([List([1,3,5]), Map({a: 1, b: 2, c: List([1,Map({aa: 100}),3])})]));
        done();
    });

    it('has(In)', function (done) {
        var col = Collection([1, 2, 3]);
        expect(col.has(1)).to.be.true;
        expect(col.has(2)).to.be.true;
        expect(col.has(4)).to.be.false;

        var list = List([1, 2, 3]);
        expect(list.has(1)).to.be.true;
        expect(list.has(2)).to.be.true;
        expect(list.has(4)).to.be.false;

        var map = Map({a: 1, b: 2, c: List([1,Map({aa: 10}),3])});
        expect(map.has('a')).to.be.true;
        expect(map.has('b')).to.be.true;
        expect(map.has('d')).to.be.false;

        var col = Collection({a: 1, b: 2, c: List([1,Map({aa: 10}),3])});
        expect(col.hasIn(['c'])).to.be.true;
        expect(col.hasIn(['c', '1'])).to.be.true;
        expect(col.hasIn(['c', '1', 'aa'])).to.be.true;
        expect(col.hasIn(['d'])).to.be.false;

        var col = Collection([1, List([[1,2,3], List([1, Collection({a:1, b: 3, c: Map({aa: 'abc'})})])])]);
        expect(col.hasIn(['1'])).to.be.true;
        expect(col.hasIn(['1', '1'])).to.be.true;
        expect(col.hasIn(['1', '1', 1])).to.be.true;
        expect(col.hasIn(['1', '1', 1, 'a'])).to.be.true;
        expect(col.hasIn(['1', '1', 1, 'b'])).to.be.true;
        expect(col.hasIn(['1', '1', 1, 'c'])).to.be.true;
        expect(col.hasIn(['1', '1', 1, 'c', 'aa'])).to.be.true;
        expect(col.hasIn(['d'])).to.be.false;

        var list = List([1, List([[1,2,3], List([1, Collection({a:1, b: 3, c: Map({aa: 'abc'})})])])]);
        expect(list.hasIn(['1'])).to.be.true;
        expect(list.hasIn(['1', '1'])).to.be.true;
        expect(list.hasIn(['1', '1', 1])).to.be.true;
        expect(list.hasIn(['1', '1', 1, 'a'])).to.be.true;
        expect(list.hasIn(['1', '1', 1, 'b'])).to.be.true;
        expect(list.hasIn(['1', '1', 1, 'c'])).to.be.true;
        expect(list.hasIn(['1', '1', 1, 'c', 'aa'])).to.be.true;
        expect(list.hasIn(['d'])).to.be.false;

        var map = Map({a: 1, b: 2, c: List([1,Map({aa: 10}),3])});
        expect(map.hasIn(['c'])).to.be.true;
        expect(map.hasIn(['c', '1'])).to.be.true;
        expect(map.hasIn(['c', '1', 'aa'])).to.be.true;
        expect(map.hasIn(['d'])).to.be.false;

        done();
    });

    it('includes', function (done) {
        var list = List([1, 2, [1]]);
        expect(list.includes([1])).to.be.false;
        var li = List([1, 2, 3]);
        var list = List([li, 2, 3, 4]);
        expect(list.includes(li)).to.be.true;
        done();
    });

    it('reduce', function (done) {
        var list = List([1,2,3,4]);
        expect(list.reduce(function (a,b) {
            return a + b + this.a;
        }, 100, {
            a: 100
        })).to.be.equal(510);
        done();
    });

    it('first/last', function (done) {
        var li = List([3]);
        var list = List([1, 2, li]);
        expect(list.first()).to.be.equal(1);
        expect(list.last()).to.be.equal(li);
        done();
    });

    it('error', function (done) {
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
