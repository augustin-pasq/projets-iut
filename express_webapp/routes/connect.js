var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('user_connect_form');
});

module.exports = router;
