/**
 * Structs
 *
 * set
 * setIn
 * get
 * getIn
 * has
 * hasIn
 * update
 * updateIn
 * keys
 * values
 * entries
 * each
 * includes
 * hashCode
 * first
 * last
 * is
 * equals
 */
;(function (global, factory) {
  typeof exports === 'object'
    && typeof module !== 'undefined'
      ? module.exports = factory(global)
      : typeof define === 'function'
        && define.amd
          ? define(factory)
          : global.Structs = factory(global);
} (this, function (w) {
  'use strict'

  var DOC = w.document,
    ISDEBUG = false,
    ARR = []
    ;

  var stringify = JSON.stringify,
    parse = JSON.parse,
    def = Object.defineProperty,
    defs = Object.defineProperties,
    $reduce = ARR.reduce,
    Structs = {}
    ;

  var TYPE = {
    COLLECTION: 'COLLECTION',
    LIST: 'LIST',
    MAP: 'MAP',
  };

  var PROTO = {
    COLLECTION: {},
    LIST: {},
    MAP: {},
  };

  var ENUM = {
    VOID0: undefined,
    NULL: null,
  };

  var ERROR = {
    FN: function (method, index) {
      return 'value at [{{index}}] does not have a `.{{method}}` method'
        .replace(/{{method}}/, method)
        .replace(/{{index}}/, index);
    },
    GETFN: function (index) {
      return this.FN('get', index);
    },
    SETFN: function (index) {
      return this.FN('set', index);
    },
    ARRAY: 'Expect the type of arguments[0] to be `array`',
    PARAM: function (index, type) {
      return 'args[{{index}}] is not type of {{type}}'
        .replace(/{{index}}/, index)
        .replace(/{{type}}/, type);
    },
    EXPECTARR: 'Expected Array or collection object of values: [object Object]',
    EXPECTOBJ: 'Expected Object or map object of values: [object Array]',
    COLLECTION: 'the object`s type must be based on `Collection`',
  };

  /*
  ** utils
   */
  function capitalize (str) {
    if (isString(str)) {
      return upper(str[0]) + lower(str.substr(1));
    }
    return '';
  };

  function extend (target) {
    var args = toArray(arguments),
      source = args.slice(1);

    if (Object.assign) {
      return Object.assign.apply(ENUM.NULL, arguments);
    } 

    else {
      source.forEach(function (s) {
        for (var key in s) {
          if (s.hasOwnProperty(key)) {
            target[key] = s[key];
          }
        }
      });
      return target;
    }
  };

  function isString (str) {
    return eq(typeof str, 'string');
  };

  function isVoid0 (obj, strict) {
    if (!strict) return obj == ENUM.VOID0;
    return eq(obj, ENUM.VOID0);
  }

  function isNumber (num) {
    return eq(typeof num, 'number');
  };

  function isObject (obj, deep) {
    if (!deep) return eq(typeof obj, 'object');
    return eq(toString(obj), '[object Object]');
  };

  function isFunction (fn) {
    return eq(toString(fn), '[object Function]');
  };

  var isArray = Array.isArray;

  function isArrayLike (obj) {
    if (isVoid0(obj)) return false;
    var length = "length" in obj && obj.length,
      type = typeof obj;

    if (eq(type, "function") || eq(w, obj)) {
        return false;
    }

    if (eq(obj.nodeType, 1) && length) {
        return true;
    }
    return eq(type, "array")
      || eq(length, 0)
      || eq(typeof length, "number")
      && length > 0
      && ( length - 1 ) in obj;
  };  

  function toString (obj) {
    return ({}.toString).call(obj);
  };

  function toIndex (num, len) {
    var intIndex;
    if (isNumber(num)) {
      return num >= 0 ? num : len + num;
    }

    else {
      intIndex = num >>> 0;
      
      if ('' + intIndex !== num || intIndex === Math.pow(2, 32) - 1) {
        return NaN;
      }

      return intIndex;
    }
  };

  function upper (str) {
    if (isString(str)) return str.toUpperCase();
    return '';
  };

  function lower (str) {
    if (isString(str)) return str.toLowerCase();
    return '';
  }; 

  function toArray (arrLike) {
    var len,
      arr
      ;

    if (len = arrLike.length) {
      arr = Array(len);

      for (var i = -1; i++ < len - 1; ) {
        arr[i] = arrLike[i];
      }
    }

    return arr;
  };

  function toObject(objLike) {
    var obj,
      keyArr,
      len
      ;

    if (isObject(objLike, true)) {
      obj = {};
      keyArr = Object.keys(objLike);
      len = keyArr.length;

      for (var i = -1; i++ < len - 1; ) {
        obj[keyArr[i]] = objLike[keyArr[i]];
      }

      return obj;
    }

    else {
      throw new Error(ERROR.PARAM(0, 'object'));
    }
  };

  function inherit (className, supProto) {
    var name = upper(className.name),
      proto
      ;

    if (supProto) {
      supProto = Object.create(supProto || ENUM.NULL);
      PROTO[name] = supProto;
    }

    proto = className.prototype = Object(supProto || PROTO[name]);
    def(proto, 'is' + capitalize(name), {
      value: true,
      writable: false,
    });
    
    defs(proto, {
      constructor: {
        value: className,
        writable: false,
      },
      _type: {
        value: TYPE[name],
        writable: false,
      },
    });
    return proto;
  };

  function eq (target, other) {
    return target === other;
  };

  function deepEqual (target, other) {
    var result;
    if (eq(target, other)) return true;

    if (target._type && other._type) {
      return target.equals(other);
    }

    if (!eq(toString(target), toString(other))) {
      return false;
    }

    if (!isObject(target) && !isObject(other)) {
      return eq(target, other);
    }

    else {
      result = forEach(target, function (tCh, index) {
        var oCh = other[index];

        if (!deepEqual(tCh, oCh)) {
          return false;          
        }
      });
      return isVoid0(result) ? true : result;
    }
  };

  function shallowEqual (target, other) {
    if (target._type && other._type) return target.equals(other);
    return eq(target, other);
  };

  function forEach (arr, cb, ctx) {
    var keyArr,
      key,
      result
      ;

    if (isArrayLike(arr)) {

      for (var i = 0, len = arr.length; i < len; i++) {
        result = cb.call(ctx || this, arr[i], i, arr);
        if (!isVoid0(result)) return result;
      }
    }

    else if (isObject(arr)) {
      keyArr = Object.keys(arr);

      for (var i = 0, len = keyArr.length; i < len; i++) {
        key = keyArr[i];
        result = cb.call(ctx || this, arr[key], key, arr);
        if (!isVoid0(result)) return result;
      }
    }
  };

  function createHashCode () {
    return Math.random().toString(36).slice(2);
  };

  function getObjectIterator (obj) {
    var keys,
      keyLen,
      values,
      entries
      ;

    if (isObject(obj, true)) {
      keys = Object.keys(obj);
      keyLen = keys.length;
      values = Array(keyLen);
      entries = Array(keyLen);

      forEach(keys, function (key, index) {
        var value = obj[key];
        values[index] = value;
        entries[index] = [key, value];
      });

      return {
        keys: keys,
        values: values,
        entries: entries,
      };
    }

    else {
      throw new Error(ERROR.PARAM(0, 'object'));
    }
  };

  /**
   * main funcitons
   */
  
  function reduceSet (struct, keyArr, value) {
    if (!keyArr.length) return value;
    var key = keyArr.shift(),
      result = struct.get(key)
      ;

    if (result && result.get) {
      return struct.set(key, reduceSet(result, keyArr, value));
    }

    else if (!keyArr.length) {
      return struct.set(key, value);
    }

    else {
      throw new Error(ERROR.GETFN(key));
    }
  };

  function newStruct (proto) {
    return function () {
      var inst = Object.create(proto);
      initCollection(inst, arguments);
      return inst;
    };
  };

  function checkDataType (inst, data) {
    switch (inst._type) {
      case TYPE.COLLECTION: {
        if (!isObject(data)) {
          throw new Error(ERROR.PARAM(0, 'object or arrayLike'));
        }
        break;
      }
      case TYPE.LIST: {
        if (!isArray(data)) {
          throw new Error(ERROR.PARAM(0, 'array'));
        }
        break;
      }
      case TYPE.MAP: {
        if (!isObject(data, true)) {
          throw new Error(ERROR.PARAM(0, 'object'));
        }
        break;
      }
    };
  };

  function initPrototype () {
    var collectProto = PROTO.COLLECTION,
      listProto = PROTO.LIST
      ;

    function set (index, value) {
      var argsLen = arguments.length, 
        newArray,
        newObject,
        arrLen = this.size,
        lastIndex,
        indexInArr
        ;

      if (this.isSetable) {
        indexInArr = index >= 0 && index < arrLen;
        index = toIndex(index, arrLen);
        lastIndex = arrLen - 1;

        if (isNaN(index)) {
          throw new Error(ERROR.PARAM(0, 'number'));
        }

        if (indexInArr && eq(this.get(index), value)) {
          return this;
        }

        newArray = toArray(this._array);

       if (eq(argsLen, 1)) {

          if (eq(index, lastIndex)) {
            newArray.length -= 1;
          }

          else if (index > lastIndex) {
            newArray.length = index;
          }

          else {
            newArray[index] = ENUM.VOID0;
          }
        }

        else {
          newArray[index] = value;
        }

        return this._fn(newArray);
      }

      else {

        if (eq(this.get(index), value)) {
          return this;
        }

        newObject = toObject(this._object);
        newObject[index] = value;
        return this._fn(newObject);
      }
    };

    function get (index) {
      if (this.isSetable) {
        index = toIndex(index, this.size);
        return this._array[index];
      }

      else {
        
        if (isObject(index)) {
          return forEach(this._entries, function (entry) {
            var key = entry[0],
              value = entry[1]
              ;

            if (eq(key, index)) {
              return value;
            }
          });
        }

        else {
          return this._object[index];
        }
      }
    };

    function setIn (arr, value) {
      if (isArray(arr)) {
        if (!arr.length) return value;
        return reduceSet(this, arr, value);
      }

      else {
        return new Error(ERROR.ARRAY);
      }
    };

    function getIn (arr) {
      if (isArray(arr)) {

        return arr.reduce(function (result, next, index) {
          if (result.get) {
            return result.get(next);
          }

          else {
            throw new Error(ERROR.GETFN(index));
          }
        }, this);
      }

      else {
        throw new Error(ERROR.ARRAY);
      }
    };

    function has (index) {
      if (this.isSetable) {
        return index < this.size && index in this._array;
      }

      else {
        return this._keys.indexOf(index) != -1;
      }
    };

    function includes (value) {
      if (!arguments.length) return false;
      var result = this.each(function (child) {

        if (shallowEqual(child, value)) {
          return true;
        }
      });
      return !isVoid0(result);
    };

    function hasIn (arr) {
      var lastIndex,
        len = arr.length,
        result
        ;

      if (isArray(arr)) {
        lastIndex = arr.pop();
        result = arr.reduce(function (result, next, index) {

          if (result.get) {
            return result.get(next);
          }

          else {
            throw new Error(ERROR.GETFN(index));
          }
        }, this);

        if (result && result.has) {
          return result.has(lastIndex);
        }

        else {
          throw new Error(ERROR.GETFN(len - 1));
        }
      }

      else {
        throw new Error(ERROR.ARRAY);
      }
    };

    function equals (struct) {
      var args = arguments,
        argsLen = args.length,
        thisValues,
        thisValue,
        structValues,
        structValue,
        result
        ;

      if (!argsLen) return false;

      if (eq(this, struct)) {
        return true;
      }

      if (this._type && struct._type) {

        if (!eq(this._type, struct._type)) {
          return false;
        }

        if (this.isCollection) {

          if (!eq(this.size, struct.size)) {
            return false;
          }

          thisValues = this.values();
          structValues = struct.values();

          while ((thisValue = thisValues.next()) && !thisValue.done) {
            thisValue = thisValue.value;
            structValue = structValues.next().value;

            if (thisValue 
              && structValue 
              && thisValue._type 
              && structValue._type) {

              if (!thisValue.equals(structValue)) {
                return false;
              }
            }

            else if (!deepEqual(thisValue, structValue)) {
              return false;
            }
          }

          return true;
        }

        else {
          throw new Error(ERROR.COLLECTION);
        }
      }

      else {
        return deepEqual(this, struct);
      }
    };

    function each (cb) {
      var iteratee = this[this.isSetable ? '_array' : '_object'];
      return forEach(iteratee, cb, this);
    };

    function keys () {
      if (this.isSetable) {
        var keyArr = Array(this.size);
        this.each(function (ch, index) {
          keyArr[index] = index;
        });
        return _Iterator(keyArr);
      }

      else {
        return _Iterator(this._keys);
      }
    };

    function values () {
      var iteratee = this[this.isSetable ? '_array' : '_values'];
      return _Iterator(iteratee);
    };

    function entries () {
      if (this.isSetable) {
        var keyArr = Array(this.size);
        this.each(function (ch, index) {
          keyArr[index] = [index, ch];
        });
        return _Iterator(keyArr);
      }

      else {
        return _Iterator(this._entries);
      }
    };

    function hashCode () {
      return this.hash;
    };

    function first () {
      if (this.isSetable) {
        return this._array[0];
      }

      else {
        return this._entries[0][1];
      }
    };

    function last () {
      if (this.isSetable) {
        return this._array[this.size - 1];
      }

      else {
        return this._entries[this.size - 1][1];
      }
    };

    function reduce (cb, initValue, ctx) {
      ctx = ctx || this;
      var applyList = [cb.bind(ctx)];

      if (!isVoid0(initValue)) {
        applyList.push(initValue);
      }

      if (this.isSetable) {
        return $reduce.apply(this._array, applyList);
      }
    };

    function update (key, defaultValue, iterator) {
      var args = arguments,
        argLen = args.length,
        value = this,
        result
        ;

      if (eq(argLen, 1)) {

        if (isFunction(key)) {
          iterator = key;
          key = defaultValue = ENUM.VOID0;
        }

        else {
          throw new Error(ERROR.PARAM(0, 'function'));
        }
      }

      else if (eq(argLen, 2) && isFunction(defaultValue)) {
        iterator = defaultValue;
        defaultValue = ENUM.VOID0;
      }

      if (!isFunction(iterator)) {
        throw new Error(ERROR.PARAM(2, 'function'));
      }

      if (!isVoid0(key)) {
        value = this.get(key);
        result = iterator(value);
        return this.set(key, isVoid0(result, true) ? defaultValue : result);
      }

      return iterator(value);
    };

    function updateIn (arr, defaultValue, iterator) {
      var args = arguments,
        argLen = args.length,
        value,
        result
        ;

      if (isArray(arr)) {

        if (isFunction(defaultValue)) {
          iterator = defaultValue;
          defaultValue = ENUM.VOID0;
        }

        if (isFunction(iterator)) {
          value = this.getIn(arr);
          result = iterator(value);
          return this.setIn(arr, isVoid0(result, true) ? defaultValue : result);
        }

        else {
          throw new Error(ERROR.PARAM(2, 'function'));
        }
      }

      else {
        throw new Error(ERROR.PARAM(0, 'array'));
      }
    };

    collectProto.set = set;
    collectProto.setIn = setIn;
    collectProto.get = get;
    collectProto.getIn = getIn;
    collectProto.has = has;
    collectProto.hasIn = hasIn;
    collectProto.update = update;
    collectProto.updateIn = updateIn;
    collectProto.keys = keys;
    collectProto.values = values;
    collectProto.entries = entries;
    collectProto.each = each;
    collectProto.includes = includes;
    collectProto.hashCode = hashCode;
    collectProto.first = first;
    collectProto.last = last;
    collectProto.is = collectProto.equals = equals;

    listProto.reduce = reduce;
  };

  function initCollection () {
    var args = arguments,
      inst = args[0],
      list = args[1],
      input = list[0],
      listLen = input.length,
      oIter
      ;

    if (isArrayLike(list)) {

      if (isVoid0(input)) {
        inst._array = [];
      }

      else {
        checkDataType(inst, input);

        if (!isArray(input)) {
          oIter = getObjectIterator(input);
          inst._object = input;
          list = inst._keys = oIter.keys;
          inst._values = oIter.values;
          inst._entries = oIter.entries;
          def(inst, 'isMapable', {
            value: true,
            writable: false
          });
        }

        else {
          list = !listLen ? [] : toArray(input);
          inst._array = list;
          def(inst, 'isSetable', {
            value: true,
            writable: false
          });
        }
      }

      defs(inst, {
        size: {
          get: function () {
            return list.length;
          },
        },
        hash: {
          value: createHashCode(),
          writable: false,
        }
      });
    }
  };

  function initIterator () {
    function Iterator () {};
    var proto = Iterator.prototype;
    function next () {
      return {
        value: this._iteratee[this._index++],
        done: this._index > this._size,
      };
    };
    proto.next = next;
    return proto;
  };

  var _Iterator = (function () {
    var proto = initIterator();
    return function (arr) {
      if (isArrayLike(arr)) {
        var inst = Object.create(proto);
        inst._index = 0;
        defs(inst, {
          _size: {
            value: arr.length,
            writable: false,
          },
          _iteratee: {
            value: arr,
            writable: false,
          }
        });
        return inst;
      }
    };
  } ());

  var _Collection = (function () {
    function Collection () {};
    var proto = inherit(Collection);
    def(proto, '_fn', {
        value: newStruct(proto),
        writable: false,
    });
    return proto._fn;
  } ());

  var _Map = (function () {
    function Map () {};
    var proto = inherit(Map, PROTO.COLLECTION);

    function isMap (target) {
      return target.isMap;
    };
    Map.isMap = isMap;

    def(proto, '_fn', {
        value: newStruct(proto),
        writable: false,
    });
    return proto._fn;
  } ());

  var _List = (function () {
    function List () {};
    var proto = inherit(List, PROTO.COLLECTION);

    function isList (target) {
      return target.isList;
    };
    List.isList = isList;

    def(proto, '_fn', {
        value: newStruct(proto),
        writable: false,
    });
    return proto._fn;
  } ());

  function _fromJS (target) {
    if (target._type) return target;
    var isArr,
      isObj
      ;

    if (isObject(target)) {
      isArr = isArray(target);
      isObj = isObject(target, true);

      if (isArr || isObj) {
        forEach(target, function (value, index) {
          target[index] = isVoid0(value) ? value : _fromJS(value);
        });
        return isArr ? _List(target) : _Map(target);
      }

      else {
        return target;
      }
    }

    else {
      return target;
    }
  };

  function init () {
    initPrototype();
    Structs.Collection = _Collection;
    Structs.List = _List;
    Structs.Map = _Map;
    Structs.fromJS = _fromJS;
  };

  init();
  global.Structs = Structs;
  return Structs;
}));