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
    BODY = DOC.body
    ;

  var stringify = JSON.stringify,
    parse = JSON.parse,
    storage = w.localStorage || {},
    db = NAME ? parse(NAME) : {}
    ;

  function extend (target) {
    var source = toArray(arguments).slice(1);

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
      storage.setItem('test', 'test');
    } catch (err) {
      var defaultProps = {
        writable: false,
        configurable: false,
        enumerable: false
      };

      Object.defineProperty(w, 'localStorage', extend(defaultProps, {
        value: new (function () {
          var _storage = {};
          Object.defineProperties(_storage, {
            setItem: extend({}, defaultProps, {
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
            getItem: extend({}, defaultProps, {
              value: function getItem (key) {
                if (!isString(key)) {
                  key = toString(key);
                }

                var result = db[key];
                if (result == null) return null;
                return result;
              }
            }),
            removeItem: extend({}, defaultProps, {
              value: function removeItem (key) {
                if (!isString(key)) {
                  key = toString(key);
                }

                delete db[key];
                w.name = stringify(db);
              }
            }),
            clear: extend({}, defaultProps, {
              value: function clear () {
                db = {};
                w.name = '';
              }
            }),
            key: extend({}, defaultProps, {
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
          });
          return _storage;
        }) ()
      }));
    }
  };

  init();
  return storage;
}));