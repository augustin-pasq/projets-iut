var express = require('express');
var router = express.Router();

/* GET page de téléversement d'activité */
router.get('/', function(req, res, next) {
  res.render('upload_activity');
});

module.exports = router;
