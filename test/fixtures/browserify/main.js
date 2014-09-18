var foo = require('./foo.js');
var bar = require('./lib/bar.js');
var elem = document.getElementById('result');
var x = foo(100) + bar('baz');
elem.textContent = x;