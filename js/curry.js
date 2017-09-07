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

  //No.1
  // function handle (fn) {
  //   return function (resolve, reject) {
  //     try{
  //       fn.apply(this, arguments);
  //     } catch (err) {
  //       onerror.apply(this, formatError(err));
  //     }
  //   };
  // };

  // var promise = new Promise(handle(function (resolve, reject) {
  //   var a = b;
  // }));

  //No.2
  // Object.defineProperty(Function.prototype, 'catch', {
  //   value: function () {
  //     var _this = this;

  //     function formatError(err) {
  //       var stack,
  //         lastStack,
  //         result,
  //         message,
  //         stackReg = /((?:(?:file|https?):\/{2,3}[^:]+|<anonymous>))(?::(\d+)(?::(\d+)|))\b/
  //         ;

  //       if (err instanceof Error) {
  //         stack = err.stack.split(/\n/g).map(function (s) {
  //           return s.trim();
  //         });
  //         message = stack[0];

  //         while (lastStack = stack.pop()) {
  //           result = lastStack.match(stackReg);

  //           if (result) {
  //             result = result.slice(1);
  //             return [message].concat(result).concat(err);
  //           }
  //         }
  //         return [message, '', '', '', err];
  //       }
  //     };

  //     return function () {
  //       try {
  //         _this.apply(this, arguments);
  //       } catch (err) {
  //         onerror.apply(this, formatError(err));
  //       }
  //     };
  //   }
  // });

  // var promise = new Promise(function (resolve, reject) {
  //   var a = b;
  // }.catch());

  w.curry = curry;
  return curry;  
}));