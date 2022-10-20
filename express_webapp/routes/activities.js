var express = require('express');
var activity_entry_dao = require('sport-track-db').activity_entry_dao;
var router = express.Router();

router.get('/', function(req, res, next) {
  if (req.session.userID == undefined) { res.redirect('/') }
  else {
    data = activity_entry_dao.findByKey(req.session.userID)
    res.render('list_activities', data);
  }
});

module.exports = router;
