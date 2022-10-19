var express = require('express');
var router = express.Router();

/* GET page de connexion */
router.get('/', function(req, res, next) {
  res.render('user_connect');
});

module.exports = router;
