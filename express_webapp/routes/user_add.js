var express = require('express');
var user_dao = require('sport-track-db').user_dao;
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('user_add_form');
});

router.post('/', async function (req, res, next) {
  var redirect = "user_add_form";
  
  var lname = req.body.lname;
  var fname = req.body.fname;
  var birthdate = req.body.birthdate;
  var sex = req.body.sex;
  var height = req.body.height;
  var weight = req.body.weight;
  var email = req.body.email;
  var password = req.body.password;

  if (await user_dao.findByKey(email) == undefined) {
    req.session.userID = email;
    user_dao.insert([lname, fname, birthdate, sex, height, weight, email, password]);
    redirect = "user_add_valid"
  }
  
  res.render(redirect, {'lname': lname, 'fname': fname, 'email': email});
});

module.exports = router;
