var foo = require('./foo.js');
var bar = require('./sub/bar.js');
var elem = document.getElementById('result');
var x = foo(100) + bar('baz');
elem.textContent = x;