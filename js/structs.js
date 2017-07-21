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
          : global.Structs = factory(global);
} (window || this, function (w) {
  'use strict'

  var DOC = w.document,
    NAME = w.name,
    BODY = DOC.body,
    ISDEBUG = false
    ;

  var stringify = JSON.stringify,
    parse = JSON.parse,
    def = Object.defineProperty,
    Structs = {}
    ;

  var Collection,
    

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

  /**
   * 
   */
   function initCollection () {

   };


  function init () {
    var Collection = initCollection();
  };

  init();
  return Structs;
}));