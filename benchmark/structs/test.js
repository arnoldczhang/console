//Benchmark
var suite = new Benchmark.Suite;

//Test 1
var obj1 = {
  a: 1,
  b: 2,
  c: [1,3, {
    d: 1,
    e: [1,2,3],
    f: {
      g: {
        h: 11
      }
    }
  }]
};

var obj2 = {
  a: 1,
  b: 2,
  c: [1,3, {
    d: 1,
    e: [1,2,3],
    f: {
      g: {
        h: 1
      }
    }
  }]
};

var toString = function (obj) {
    return ({}.toString).call(obj);
  };

  function forEach (arr, cb, ctx) {
    var keyArr,
      key,
      result
      ;

    if (Array.isArray(arr)) {

      for (var i = 0, len = arr.length; i < len; i++) {
        result = cb.call(ctx || this, arr[i], i, arr);
        if (result != null) return result;
      }
    }

    else {
      keyArr = Object.keys(arr);

      for (var i = 0, len = keyArr.length; i < len; i++) {
        key = keyArr[i];
        result = cb.call(ctx || this, arr[key], key, arr);
        if (result != null) return result;
      }
    }
  };

  function deepEqual (target, other) {
    var result;
    if (target === other) return true;

    if (!toString(target) === toString(other)) {
      return false;
    }

    if (!(typeof target != 'object') && !(typeof other != 'object')) {
      return target === other;
    }

    else {
      result = forEach(target, function (tCh, index) {
        var oCh = other[index];

        if (!deepEqual(tCh, oCh)) {
          return false;          
        }
      });
      return result == null ? true : result;
    }
  };

suite
.add('Structs', function() {
  var fromJS = Structs.fromJS;
  function deepEqual (obj1, obj2) {
    obj1.equals(obj2);
  };
  deepEqual(fromJS(obj1), fromJS(obj2));
})
.add('Simple compare', function() {
  deepEqual(obj1, obj2);
})
.add('immutablejs', function () {
  var fromJS = Immutable.fromJS;
  function deepEqual (obj1, obj2) {
    obj1.equals(obj2);
  };
  deepEqual(fromJS(obj1), fromJS(obj2));
})
.on('cycle', function(event) {
    console.log(String(event.target));
}).on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map(function (bch) {
        return bch.name;
    }).toString());
}).run({ 'async': true });
