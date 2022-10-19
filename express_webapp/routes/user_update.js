var express = require('express');
var user_dao = require('sport-track-db').user_dao;
var router = express.Router();

router.get('/', async function(req, res, next) {

  if (req.session.userID == undefined) { res.redirect('/') }
  else {

    var user = await user_dao.findByKey(req.session.userID);

    var lname = user.lname;
    var fname = user.fname;
    var birthdate = user.birthdate;
    var sex = user.sex;
    var height = user.height;
    var weight = user.weight;
    var email = req.session.userID;

    res.render('user_update_form', {'lname': lname, 'fname': fname, 'birthdate': birthdate, 'sex': sex, 'height': height, 'weight': weight, 'email': email});
  }
});

router.post('/', async function (req, res, next) {
  
  var lname = req.body.lname;
  var fname = req.body.fname;
  var birthdate = req.body.birthdate;
  var sex = req.body.sex;
  var height = req.body.height;
  var weight = req.body.weight;
  var email = req.session.userID;

  await user_dao.update([lname, fname, birthdate, sex, height, weight], email);
  
  res.render("user_update_form", {'lname': lname, 'fname': fname, 'birthdate': birthdate, 'sex': sex, 'height': height, 'weight': weight, 'email': email, 'isUpdated': true});
});

module.exports = router;
