var express = require('express');
var router = express.Router();

/* GET page d'inscription */
router.get('/', function(req, res, next) {
  res.render('user_add');
});

module.exports = router;
