var express = require('express');
var router = express.Router();
var bundles = require('../bundle.result.json'); // get the resulting bundle json as an object

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express', bundle: bundles }); // pass it onto the view
});

module.exports = router;
