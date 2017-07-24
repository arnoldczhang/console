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
    ISDEBUG = false
    ;

  var stringify = JSON.stringify,
    parse = JSON.parse,
    def = Object.defineProperty,
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

  var ERROR = {
    GETFN: function (index) {
      return 'value at [{{index}}] does not have a `.get` method'.replace(/{{index}}/, index); 
    },
    SETFN: function (index) {
      return 'value at [{{index}}] does not have a `.set` method'.replace(/{{index}}/, index); 
    },
    SETIN: 'Expect the type of arguments[0] to be `array`',
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
      return Object.assign.apply(null, arguments);
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

  var isArray = Array.isArray;

  function isArrayLike (obj) {
    if (obj == null) return false;
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
      supProto = Object.create(supProto || null);
      PROTO[name] = supProto;
    }

    proto = className.prototype = Object(supProto || PROTO[name]);
    proto.constructor = className;
    proto._type = TYPE[name];
    proto['is' + capitalize(name)] = true;
    return proto;
  };

  /**
   * 
   */
  function initPrototype () {
    var collectProto = PROTO.COLLECTION,
      listProto = PROTO.LIST
      ;

    function set (index, value) {
      index = toIndex(index, this._array.length);
      var argsLen = arguments.length, 
        isSetable = this.isCollection || this.isList,
        newArray,
        newLen,
        lastIndex
        ;
        
      if (isSetable) {
        newArray = toArray(this._array);
        newLen = newArray.length;
        lastIndex = newLen - 1;

        if (argsLen === 1) {

          if (index === lastIndex) {
            newArray.length -= 1;
          }

          else if (index > lastIndex) {
            newArray.length = index;
          }

          else {
            newArray[index] = void 0;
          }

        }

        else {
          newArray[index] = value;
        }

        return this._fn(newArray);
      }
    };

    function get (index) {
      index = toIndex(index, this._array.length);
      var isSetable = this.isCollection || this.isList;
      if (isSetable) {
        return this._array[index];
      }
      return null;
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
        }, this)

        if (result && result.set) {
          return result.set(lastIndex, value);
        }

        else {
          throw new Error(ERROR.SETFN(lastIndex));
        }

      }

      else {
        return new Error(ERROR.SETIN);
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
        throw new Error(ERROR.SETIN);
      }
    };

    function equals () {

    };

    collectProto.set = set;
    collectProto.get = get;
    collectProto.setIn = setIn;
    collectProto.getIn = getIn;
    collectProto.is = collectProto.equals = equals;
  };

  function initCollection () {
    var args = arguments,
      inst = args[0],
      list = args[1],
      first = list[0]
      ;

    if (isArrayLike(list)) {
      list = list.length > 1 ? toArray(list) : isArray(first) ? first : [first];
      inst._array = list;
      def(inst, 'size', {
        get: function () {
          return list.length;
        }
      });
    }
  };

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