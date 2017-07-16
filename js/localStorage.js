/**
 * localStorage
 * 
 */

;(function (global, factory) {
  typeof exports === 'object' 
    && typeof module !== 'undefined' 
      ? module.exports = factory(global) 
      : typeof define === 'function' 
        && define.amd 
          ? define(factory) 
          : global.localStorage = factory(global);
} (window || this, function (w) {
  'use strict'

  var DOC = w.document,
    NAME = w.name,
    BODY = DOC.body,
    ISDEBUG = false
    ;

  var stringify = JSON.stringify,
    parse = JSON.parse,
    storage = w.localStorage || {},
    db = NAME ? parse(NAME) : {},
    def = Object.defineProperty
    ;

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

  function toString (obj) {
    return ({}.toString).call(obj);
  };

  function toArray (arrLike) {
    var len,
      arr = []
      ;

    if (len = arrLike.length) {
      for (var i = -1; i++ < len - 1; ) {
        arr[i] = arrLike[i];
      }      
    }

    return arr;
  };

  function init () {
    try {
      ISDEBUG ? (aa = bb) : storage.setItem('test', 'test');
    } catch (err) {
      var GLOBAL = {
        Storage: function Storage () {}
      };

      var defaultProps = {
        writable: false,
        configurable: false,
        enumerable: false
      };

      function extendDefault (target) {
        var obj = {};
        return extend(obj, defaultProps, target);
      };

      GLOBAL._Storage = function _Storage () {
        Object.defineProperties(this, {

          setItem: extendDefault({
            value: function setItem (key, value) {
              if (!isString(key)) {
                key = toString(key);
              }

              if (!isString(value)) {
                value = toString(value);
              }

              db[key] = value;
              w.name = stringify(db);
            }
          }),

          getItem: extendDefault({
            value: function getItem (key) {
              if (!isString(key)) {
                key = toString(key);
              }

              var result = db[key];
              if (result == null) return null;
              return result;
            }
          }),

          removeItem: extendDefault({
            value: function removeItem (key) {
              if (!isString(key)) {
                key = toString(key);
              }

              delete db[key];
              w.name = stringify(db);
            }
          }),

          clear: extendDefault({
            value: function clear () {
              db = {};
              w.name = '';
            }
          }),

          key: extendDefault({
            value: function key (index) {
              if (!arguments.length) {
                return new TypeError('Failed to execute \'key\' on \'Storage\': 1 argument required, but only 0 present.');
              }

              return Object.keys(db)[Number(index) || 0];
            }
          }),

          length: extend({}, {
            configurable: false,
            enumerable: false,
            get: function length () {
              return Object.keys(db).length;
            }
          }),

          constructor: extendDefault({
            value: GLOBAL.Storage,
            writable: true
          })
        });
      };

      def(GLOBAL.Storage, 'name', extendDefault({
        value: 'Storage'
      }));

      def(GLOBAL._Storage.prototype, 'constructor', extendDefault({
        value: GLOBAL.Storage,
        writable: true
      }));

      GLOBAL.Storage.prototype = new GLOBAL._Storage;
      var localStorage = new GLOBAL.Storage;
      def(w, 'localStorage', extendDefault({
        value: localStorage
      }));
    }
  };

  init();
  return storage;
}));