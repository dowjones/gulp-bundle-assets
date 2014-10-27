(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var foo = require('./foo.js');
var bar = require('./sub/bar.js');
var elem = document.getElementById('result');
var x = foo(100) + bar('baz');
elem.textContent = x;
},{"./foo.js":2,"./sub/bar.js":3}],2:[function(require,module,exports){
module.exports = function (n) { return n * 111 };
},{}],3:[function(require,module,exports){
module.exports = function(str) {
  return str.length;
};
},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9tb250Z29tZXJ5Yy9Qcm9qZWN0cy9ndWxwLWJ1bmRsZS1hc3NldHMvZXhhbXBsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL21vbnRnb21lcnljL1Byb2plY3RzL2d1bHAtYnVuZGxlLWFzc2V0cy9leGFtcGxlcy9icm93c2VyaWZ5L2xpYi9lbnRyeS5qcyIsIi9Vc2Vycy9tb250Z29tZXJ5Yy9Qcm9qZWN0cy9ndWxwLWJ1bmRsZS1hc3NldHMvZXhhbXBsZXMvYnJvd3NlcmlmeS9saWIvZm9vLmpzIiwiL1VzZXJzL21vbnRnb21lcnljL1Byb2plY3RzL2d1bHAtYnVuZGxlLWFzc2V0cy9leGFtcGxlcy9icm93c2VyaWZ5L2xpYi9zdWIvYmFyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTs7QUNBQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIGZvbyA9IHJlcXVpcmUoJy4vZm9vLmpzJyk7XG52YXIgYmFyID0gcmVxdWlyZSgnLi9zdWIvYmFyLmpzJyk7XG52YXIgZWxlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXN1bHQnKTtcbnZhciB4ID0gZm9vKDEwMCkgKyBiYXIoJ2JheicpO1xuZWxlbS50ZXh0Q29udGVudCA9IHg7IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobikgeyByZXR1cm4gbiAqIDExMSB9OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oc3RyKSB7XG4gIHJldHVybiBzdHIubGVuZ3RoO1xufTsiXX0=
