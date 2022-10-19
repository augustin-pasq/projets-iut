var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('upload_activity_form');
});

module.exports = router;
