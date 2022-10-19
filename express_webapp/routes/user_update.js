var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('user_update_form');
});

module.exports = router;
