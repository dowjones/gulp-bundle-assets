var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();

var comments = [{author: 'Pete Hunt', text: 'Hey there!'}];

app.use('/public', express.static(path.join(__dirname, 'public')));
app.engine('html', require('ejs').__express);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// include bundle.result.json in every view model
app.locals.bundle = require('./bundle.result.json');

app.get('/', function (req, res) {
  res.render('index');
});

app.get('/comments.json', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(comments));
});

app.post('/comments.json', function(req, res) {
  comments.push(req.body);
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(comments));
});

app.listen(3000);

console.log('Server started: http://localhost:3000/');
