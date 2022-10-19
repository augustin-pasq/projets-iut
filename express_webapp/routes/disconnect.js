var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  if (req.session.userID == undefined) { res.redirect('/') }
  else {
    req.session.destroy();
    res.render('user_disconnect', {'isDisconnected': true});
  }
});

module.exports = router;
