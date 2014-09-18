(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = function (n) { return n * 111 };
},{}],2:[function(require,module,exports){
var foo = require('./foo.js');
var bar = require('./sub/bar.js');
var elem = document.getElementById('result');
var x = foo(100) + bar('baz');
elem.textContent = x;
},{"./foo.js":1,"./sub/bar.js":3}],3:[function(require,module,exports){
module.exports = function(str) {
  return str.length;
};
},{}]},{},[2])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9tb250Z29tZXJ5Yy9Qcm9qZWN0cy9ndWxwLWJ1bmRsZS1hc3NldHMvZXhhbXBsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL21vbnRnb21lcnljL1Byb2plY3RzL2d1bHAtYnVuZGxlLWFzc2V0cy9leGFtcGxlcy9icm93c2VyaWZ5L2xpYi9mb28uanMiLCIvVXNlcnMvbW9udGdvbWVyeWMvUHJvamVjdHMvZ3VscC1idW5kbGUtYXNzZXRzL2V4YW1wbGVzL2Jyb3dzZXJpZnkvbGliL21haW4uanMiLCIvVXNlcnMvbW9udGdvbWVyeWMvUHJvamVjdHMvZ3VscC1idW5kbGUtYXNzZXRzL2V4YW1wbGVzL2Jyb3dzZXJpZnkvbGliL3N1Yi9iYXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChuKSB7IHJldHVybiBuICogMTExIH07IiwidmFyIGZvbyA9IHJlcXVpcmUoJy4vZm9vLmpzJyk7XG52YXIgYmFyID0gcmVxdWlyZSgnLi9zdWIvYmFyLmpzJyk7XG52YXIgZWxlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXN1bHQnKTtcbnZhciB4ID0gZm9vKDEwMCkgKyBiYXIoJ2JheicpO1xuZWxlbS50ZXh0Q29udGVudCA9IHg7IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihzdHIpIHtcbiAgcmV0dXJuIHN0ci5sZW5ndGg7XG59OyJdfQ==
