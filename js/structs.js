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
  };

  var PROTO = {
    COLLECTION: {},
    LIST: {},
  };

  var ENUM = {
    VOID0: undefined,
    NULL: null,
  };

  var ERROR = {
    GETFN: function (index) {
      return 'value at [{{index}}] does not have a `.get` method'.replace(/{{index}}/, index); 
    },
    SETFN: function (index) {
      return 'value at [{{index}}] does not have a `.set` method'.replace(/{{index}}/, index); 
    },
    ARRAY: 'Expect the type of arguments[0] to be `array`',
  };

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

  function isNumber (num) {
    return typeof num === 'number';
  };

  function isObject (obj) {
    return typeof obj === 'object';
  };

  var isArray = Array.isArray;

  function isArrayLike (obj) {
    if (obj == ENUM.NULL) return false;
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
    if (isString(str)) {
      return str.toUpperCase();
    }
    return '';
  };

  function lower (str) {
    if (isString(str)) {
      return str.toLowerCase();
    }
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
      return result === ENUM.VOID0 ? true : result;
    }

  };

  function shallowEqual (target, other) {
    if (target._type && other._type) {
      return target.equals(other);
    }

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
        if (result != ENUM.NULL) return result;
      }

    }

    else if (isObject(arr)) {
      keyArr = Object.keys(arr);

      for (var i = 0, len = keyArr.length; i < len; i++) {
        key = keyArr[i];
        result = cb.call(ctx || this, arr[key], key, arr);
        if (result != ENUM.NULL) return result;
      }

    }
  };

  function createHashCode () {
    return Math.random().toString(36).slice(2);
  };

  /**
   * 
   */
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
        var lastIndex = arr.pop();
        var result = arr.reduce(function (res, next, index) {
          if (res.get) {
            return res.get(next);
          }

          else {
            throw new Error(ERROR.GETFN(index));
          }
        }, this);

        if (result && result.set) {
          return result.set(lastIndex, value);
        }

        else {
          throw new Error(ERROR.SETFN(lastIndex));
        }

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
      return result != ENUM.VOID0;
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

            if (thisValue && structValue 
              && thisValue._type && structValue._type) {

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

      if (initValue !== ENUM.VOID0) {
        applyList.push(initValue);
      }

      if (this.isSetable) {
        return $reduce.apply(this._array, applyList);
      }

      else {
        // TODO
      }
    };

    function update () {

    }

    collectProto.set = set;
    collectProto.get = get;
    collectProto.setIn = setIn;
    collectProto.getIn = getIn;
    collectProto.keys = keys;
    collectProto.values = values;
    collectProto.each = each;
    collectProto.has = has;
    collectProto.hasIn = hasIn;
    collectProto.includes = includes;
    collectProto.hashCode = hashCode;
    collectProto.first = first;
    collectProto.last = last;
    collectProto.reduce = reduce;
    collectProto.is = collectProto.equals = equals;
  };

  function initCollection () {
    var args = arguments,
      inst = args[0],
      list = args[1],
      first = list[0]
      ;

    if (isArrayLike(list)) {

      if (first == ENUM.NULL) {
        inst._array = [];
      }

      else {
        list = list.length > 1 ? toArray(list) : isArray(first) ? toArray(first) : [first];
      }

      inst._array = list;
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
    proto._fn = function () {
      var inst = Object.create(proto);
      initCollection(inst, arguments);
      return inst;
    };
    return proto._fn;
  } ());

  var _List = (function () {
    function List () {};
    var proto = inherit(List, PROTO.COLLECTION);

    function isList (target) {
      return target.isList;
    };
    List.isList = isList;
    proto._fn = function () {
      var inst = Object.create(proto);
      initCollection(inst, arguments);
      return inst;
    };
    return proto._fn;
  } ());

  function init () {
    initPrototype();
    Structs.Collection = _Collection;
    Structs.List = _List;
  };

  init();
  global.Structs = Structs;
  return Structs;
}));