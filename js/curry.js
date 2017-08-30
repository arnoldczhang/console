;(function (global, factory) {
  typeof exports === 'object'
    && typeof module !== 'undefined'
      ? module.exports = factory(global)
      : typeof define === 'function'
        && define.amd
          ? define(factory)
          : global.curry = factory(global);
} (this, function (w) {
  'use strict'

  w = w || window;
  function curry (fn, length, paramArr) {
    var length = typeof length === 'undefined' ? fn.length : length;
    var paramArr = Array.isArray(paramArr) ? paramArr : null;
    var argObj = {};
    var argKeyArr = [];

    function _contains (keyArr, partial) {
      return partial.every(function (key) {
        return keyArr.indexOf(key) !== -1;
      });
    };

    return function (arg) {
      if (typeof arg === 'object') {
        var key = Object.keys(arg)[0];

        if (argKeyArr.indexOf(key) === -1) {
          argKeyArr.push(key);        
        }
        argObj[key] = arg[key];

        if (argKeyArr.length >= length) {
          if (!paramArr || _contains(argKeyArr, paramArr)) {
            return fn(argObj);
          }
        }
      }
    };
  };

  w.curry = curry;
  return curry;  
}));