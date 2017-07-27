/**
 * Structs
 * 
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
    return typeof str === 'string';
  };

  function isVoid0 (obj, strict) {
    if (!strict) return obj == ENUM.VOID0;
    return obj === ENUM.VOID0;
  }

  function isNumber (num) {
    return typeof num === 'number';
  };

  function isObject (obj, deep) {
    if (!deep) return typeof obj === 'object';
    return toString(obj) === '[object Object]';
  };

  function isFunction (fn) {
    return toString(fn) === '[object Function]';
  };

  var isArray = Array.isArray;

  function isArrayLike (obj) {
    if (isVoid0(obj)) return false;
    var length = "length" in obj && obj.length,
      type = typeof obj;

    if (type === "function" || w === obj) {
        return false;
    }

    if (obj.nodeType === 1 && length) {
        return true;
    }
    return type === "array" 
      || length === 0 
      || typeof length === "number" 
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
      isSetable: {
        value: proto.isCollection || proto.isList,
        writable: false,
      }
    });
    return proto;
  };

  function deepEqual (target, other) {
    var result;
    if (target === other) return true;

    if (target._type && other._type) {
      return target.equals(other);
    }

    if (toString(target) !== toString(other)) {
      return false;
    }

    if (!isObject(target) && !isObject(other)) {
      return target === other;
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
    return target === other;
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
    if (!keyArr.length) return struct;
    var key = keyArr.shift(),
      result = struct.get(key)
      ;

    if (result.get) {
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

  function checkDataType (type, firstObj, list) {
    switch (type) {
      case TYPE.COLLECTION: {

      }
      case TYPE.LIST: {

      }
      case TYPE.MAP: {

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
        arrLen = this.size,
        lastIndex = arrLen - 1,
        indexInArr = index >= 0 && index < arrLen
        ;
      index = toIndex(index, arrLen);

      if (isNaN(index)) {
        throw new Error(ERROR.PARAM(0, 'number'));
      }
        
      if (this.isSetable) {

        if (indexInArr && this.get(index) === value) {
          return this;
        }

        newArray = toArray(this._array);

       if (argsLen === 1) {

          if (index === lastIndex) {
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
      }

      else {
        // TODO
      }
      
      return this._fn(newArray);
    };

    function get (index) {
      index = toIndex(index, this.size);
      if (this.isSetable) {
        return this._array[index];
      }

      else {
        // TODO
      }

      return ENUM.NULL;
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

        if (this.isSetable) {
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
          // TODO
        }
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
        // TODO
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

      if (this === struct) {
        return true;
      }

      if (this._type && struct._type) {

        if (this._type !== struct._type) {
          return false;
        }

        if (this.isSetable) {

          if (this.size !== struct.size) {
            return false;
          }

          values = this.values();
          structValues = struct.values();

          while ((thisValue = values.next()) && !thisValue.done) {
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
          // TODO
        }
      }

      else {
        return deepEqual(this, struct);
      }
    };

    function each (cb) {
      if (this.isSetable) {
        return forEach(this._array, cb, this);
      }

      else {
        // TODO
      }
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
        // TODO
      }
    };

    function values () {
      if (this.isSetable) {
        return _Iterator(this._array);
      }

      else {
        // TODO
      }
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
        // TODO
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
        // TODO
      }
    };

    function last () {
      if (this.isSetable) {
        return this._array[this.size - 1];
      }

      else {
        // TODO
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

      else {
        // TODO
      }
    };

    function update (key, defaultValue, iterator) {
      var args = arguments,
        argLen = args.length,
        value = this,
        result
        ;

      if (argLen === 1) {

        if (isFunction(key)) {
          iterator = key;
          key = defaultValue = ENUM.VOID0;
        }

        else {
          throw new Error(ERROR.PARAM(0, 'function'));
        }
      }

      else if (argLen === 2 && isFunction(defaultValue)) {
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
    collectProto.get = get;
    collectProto.setIn = setIn;
    collectProto.getIn = getIn;
    collectProto.keys = keys;
    collectProto.values = values;
    collectProto.entries = entries;
    collectProto.each = each;
    collectProto.has = has;
    collectProto.hasIn = hasIn;
    collectProto.includes = includes;
    collectProto.hashCode = hashCode;
    collectProto.first = first;
    collectProto.last = last;
    collectProto.update = update;
    collectProto.updateIn = updateIn;
    collectProto.is = collectProto.equals = equals;

    listProto.reduce = reduce;
  };

  function initCollection () {
    var args = arguments,
      inst = args[0],
      list = args[1],
      first = list[0],
      oIter
      ;

    if (isArrayLike(list)) {

      if (isVoid0(first)) {
        inst._array = [];
      }

      else {
        checkDataType(inst._type, first, list);
        if (isObject(first, true) && list.length === 1) {
          oIter = getObjectIterator(first);
          inst._object = first;
          list = inst._keys = oIter.keys;
          inst._values = oIter.values;
          inst._entries = oIter.entries;
          def(inst, 'isSetable', {
            value: false,
            writable: false,
          });
        }

        else {
          list = list.length > 1 ? toArray(list) : isArray(first) ? toArray(first) : [first];
          inst._array = list;
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

  function init () {
    initPrototype();
    Structs.Collection = _Collection;
    Structs.List = _List;
    Structs.Map = _Map;
  };

  init();
  global.Structs = Structs;
  return Structs;
}));