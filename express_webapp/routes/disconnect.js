var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('user_disconnect', {'isDisconnected': true});
});

module.exports = router;
