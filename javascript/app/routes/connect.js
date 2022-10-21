var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
var user_dao = require('sport-track-db').user_dao;

router.get('/', function (req, res, next) {
  res.render('user_connect_form', { 'badCredentials': true });
});

router.post('/', async function (req, res, next) {
  var redirect = "user_connect_form";
  var data = { 'badCredentials': false };

  var email = req.body.email;
  var password = req.body.password;
  var user = await user_dao.findByKey(email);

  if (user != undefined) var userPassword = user.password;
  if (userPassword != undefined && bcrypt.compareSync(password, userPassword)) {
    req.session.userID = email;
    data.badCredentials = true;
    data.fname = user.fname;
    redirect = "user_connect_valid";
  }

  res.render(redirect, data);
});

module.exports = router;
