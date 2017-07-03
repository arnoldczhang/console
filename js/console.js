/**
 * console
 * 
 */

;(function (global, factory) {
  typeof exports === 'object' 
    && typeof module !== 'undefined' 
      ? module.exports = factory(global) 
      : typeof define === 'function' 
        && define.amd 
          ? define(factory) 
          : global.console = factory(global);
} (window || this, function (w) {
  'use strict'

  var DOC = w.document,
    BODY = DOC.body,
    BTN,
    CONSOLE,
    INPUT,
    CONTENT,
    SURE,
    CLEAR,
    MASK,
    BTNH,
    BTNW;

  var console = w.console || {},
    style = require('../css/console.less.module'),
    btnText = getBtnText(),
    mainText = getMainText(),
    node = document.createElement('div')
    ;

  function extend (target, source) {
    for (var key in source) {

      if (source.hasOwnProperty(key)) {
        target[key] = source[key];
      }

    }

    return target;
  };

  function wrap (html) {
    node.innerHTML = html;
    return node.children[0];
  };

  function lower (str) {
    return String(str).toLowerCase();
  };

  function css (el, key, value, psudo) {
    var isSet = arguments.length > 2;

    if (isSet) {
      el.style[key] = value;
    }

    else {
      return getComputedStyle(el, psudo || null).getPropertyValue(key);
    }

  };

  function addEvent (el, type, handler) {
    return el.addEventListener(type, handler, false);
  };

  function toggleClass (el, className) {
    if (el.classList.contains(className)) {
      return el.classList.remove(className);
    }

    return el.classList.add(className);
  }

  function addClass (el, className) {
    el.classList.add(className);
  };

  function removeClass (el, className) {
    if (el.classList.contains(className)) {
      return el.classList.remove(className);
    }
  };

  function toArray (arrLike) {
    var len,
      arr = [];

    if (len = arrLike.length) {
      for (var i = -1; i++ < len - 1; ) {
        arr[i] = arrLike[i];
      }      
    }

    return arr;
  };

  function toNumber (str) {
    return parseInt(str, 10);
  };

  function isObject (obj) {
    return typeof obj === 'object';
  };

  function isError (err) {
    return ({}.toString).call(err) === '[object Error]';
  };

  function isArrayLike (obj) {
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

  function isNode (obj) {
    return isObject(obj)
      && obj.nodeType
      && obj.nodeName;
  };

  function query (selector) {
    return DOC.querySelector(selector);
  };

  function delay (cb, timeout, arg) {
    return setTimeout(cb.bind(null, arg), timeout || 0);
  };

  /********dom init********/
  function init () {
    if (BODY) {
      return _initNode();
    }

    return delay(_initNode);

    function _initNode () {
      var body = BODY || (BODY = DOC.body);
      BTN = wrap(btnText);
      body.appendChild(BTN);
      initBtn();
      initConsole();
    };

  };

  function initBtn () {
    getBtnStyle();
    addBtnEvent();
  };

  function initConsole () {
    CONSOLE = wrap(mainText);
    BODY.appendChild(CONSOLE);
    MASK = query("." + style.mask);
    INPUT = query("." + style.input);
    CONTENT = query("." + style.content);
    SURE = query("." + style.enter);
    CLEAR = query("." + style.clear);
    addConsoleEvt();
  };

  function getBtnStyle () {
    BTNH = toNumber(css(BTN, 'height'));
    BTNW = toNumber(css(BTN, 'width'));
  };

  function addBtnEvent () {
    var _startX,
      _startY,
      _dist = 10,
      _movable = false;

    addEvent(BTN, 'mousedown', _startEvt);
    addEvent(BTN, 'touchstart', _startEvt);
    addEvent(BTN, 'touchmove', _moveEvt);
    addEvent(BTN, 'mousemove', _moveEvt);
    addEvent(BTN, 'mouseup', _endEvt);
    addEvent(BTN, 'touchend', _endEvt);

    function _startEvt (e) {
      var pos = getPos(e);
      _movable = true;
      _startX = pos.pageX;
      _startY = pos.pageY;
    };

    function _moveEvt (e) {
      if (!_movable) return;
      var pos = getPos(e),
        pageX = pos.pageX,
        pageY = pos.pageY;
      resetBtnPos(pageX, pageY);
    };

    function _endEvt (e) {
      _movable = false;
      var pos = getPos(e),
        pageX = pos.pageX,
        pageY = pos.pageY;

      if (Math.abs(pageX - _startX) <= _dist 
        && Math.abs(pageY - _startY) <= _dist) {
        delay(function () {
          openConsole();
        });
      }

      _startX = pageX;
      _startY = pageY;
    };

  };

  function getPos (evt) {
    evt = evt || {};
    return evt.changedTouches ? evt.changedTouches[0] : evt;
  };

  function resetBtnPos (x, y) {
    BTN.style.left = x - BTNW / 2 + 'px';
    BTN.style.top = y - BTNH / 2 + 'px';
  };

  function openConsole () {
    addClass(CONSOLE, style.show);
    delay(function () {
      addClass(CONSOLE, style.open);
    }, 100);

  };

  function addConsoleEvt () {
    var _startX,
      _startY,
      _dist = 10,
      _movable = false;

    // addEvent(MASK, 'mouseup', _closeConsole);
    addEvent(MASK, 'touchend', _closeConsole);
    addEvent(INPUT, 'blur', _doConsole);
    // addEvent(CONTENT, 'mouseup', _toggleContent);
    addEvent(CONTENT, 'touchstart', _toggleStartContent);
    addEvent(CONTENT, 'touchend', _toggleContent);
    addEvent(SURE, 'touchend', _sureContent);
    addEvent(CLEAR, 'touchend', _clearContent);

    function _closeConsole (e) {
      removeClass(CONSOLE, style.open);
      delay(function () {
        removeClass(CONSOLE, style.show);
      }, 300);

    };

    function  _toggleStartContent (e) {
      var pos = getPos(e);
      _movable = true;
      _startX = pos.pageX;
      _startY = pos.pageY;
    };

    function _toggleContent (e) {
      var pos = getPos(e),
        pageX = pos.pageX,
        pageY = pos.pageY;

      if (Math.abs(pageX - _startX) <= _dist 
        && Math.abs(pageY - _startY) <= _dist) {
        var target = getLiParent(e.srcElement);
        toggleClass(target, style.ctOpen);
      }
      
    };

    function _doConsole (e) {
      var value = INPUT.value;
      try {
        new Function(value)();
      } catch (err) {
        console.log(err);
      }
    };

    function _sureContent (e) {
      _doConsole(e);
      INPUT.value = '';
    };

    function _clearContent (e) {
      INPUT.value = '';
      CONTENT.innerHTML = '';
    };

  };

  function getLiParent (target) {
    if (lower(target.nodeName) === 'li') return target;
    var parent = target.parentNode;

    if (lower(parent.nodeName) === 'li') {
      return parent;
    }

    return getLiParent(parent);
  };

  function getBtnText () {
    return "<div class='" + style.btn + "'>console</div>";
  };

  function getMainText () {
    return "\
      <article class='" + style.window + "'>\
        <section class='" + style.mask + "'></section>\
        <article class='" + style.container + "'>\
          <header class='" + style.header + "'></header>\
          <article class='" + style.body + "'>\
            <ul class='" + style.content + "'>\
            </ul>\
          </article>\
          <footer class='" + style.footer + "'>\
            <input type='text' class='" + style.input + "' placeholder='请输入...'/>\
            <span class='" + style.enter + "'>确认</span>\
            <span class='" + style.clear + "'>清除</span>\
          </footer>\
        </article>\
      </article>\
    ";
  };

  function getLogText () {
    var time = (new Date).toString().substring(16, 24);
    var text = toArray(arguments);
    text.map(function (t, i, arr) {
      arr[i] = "<code class='" + style.arg + "'>" + analyzeObjText(t) + "</code>";
    });

    return "\
      <li class='" + style.li + "'>\
        <span class='" + style.word + "'>" + text.join(' ') + "</span>\
        <span class='" + style.time + "'>" + time + "</span>\
      </li>\
    ";
  };

  function analyzeObjText (text) {
    var arr = [],
      len,
      i = -1;
    
    if (isObject(text)) {

      if (isArrayLike(text)) {
        len = text.length;

        for ( ; i++ < len; ) {
          arr[i] = analyzeObjText(text[i]);
        }

        return '[\n'
          + arr.join(',\n')
          + ']';
      }

      else if (isNode(text)) {
        return getAst(text);
      }

      else {

        if (!isError(text)) {
          return JSON.stringify(text, null, ' ')
            .replace(/ /g, '&nbsp;')
            .replace(/[\n\r]/g, '<br />');
        }

        else {
          return text.stack
            .replace(/ /g, '&nbsp;')
            .replace(/[\n\r]/g, '<br />');
        }
        
      }

    }
    
    return text;
  };

  function getAst (node) {
    var nodeName = lower(node.nodeName),
      nodeValue = node.nodeValue,
      id = node.id ? node.id : '',
      className = node.className ? node.className : '',
      children = node.childNodes,
      obj = {};

    id && (obj.id = id);
    className && (obj.className = className);
    children.length && (obj.children = flattenNode(children));
    nodeValue && (obj.value = nodeValue);
    return nodeName + analyzeObjText(obj);
  };

  function flattenNode (children) {
    return toArray(children).map(function (child) {
      return {
        nodeName: child.nodeName,
        id: child.id,
        className: child.className,
        nodeValue: child.nodeValue,
        children: flattenNode(child.children || [])
      };
    });
  };

  /********extend**********/
  function log () {
    delay(function (args) {
      CONTENT.appendChild(wrap(getLogText.apply(null, args)));
    }, 0, arguments);
  };

  function error () {

  };

  function warn () {

  };

  extend(console, {
    log: log,
    // error: error,
    // warn: warn
  });

  init();
  return console;
}));