var express = require('express');
var formidable = require('formidable');
var router = express.Router();

router.get('/', async function (req, res, next) {
  if (req.session.userID == undefined) { res.redirect('/') }
  else {
    res.render('upload_activity_form');
  }
});

router.post('/', function (req, res) {
  var form = new formidable.IncomingForm();
  form.multiples = true;
  form.maxFileSize = 50 * 1024 * 1024; // 5MB
  form.parse(req, (err, fields, files) => {
    if (err) {
      next(err);
      return;
    }
    console.log(files)
    res.json({ fields, files });
  });

});

module.exports = router;
