var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  delete req.session.userID;
  res.render('user_disconnect', {'isDisconnected': true});
});

module.exports = router;
