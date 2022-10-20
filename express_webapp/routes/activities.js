var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  if (req.session.userID == undefined) { res.redirect('/') }
  else {
    


    res.render('list_activities', data);
  }
});

module.exports = router;
