var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  if (req.session.userID == undefined) { res.redirect('/') }
  else {
    res.render('upload_activity_form');
  }
});

module.exports = router;
