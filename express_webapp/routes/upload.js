var express = require('express');
var activity_entry_dao = require('sport-track-db').activity_entry_dao;
var db = require('sport-track-db').db;
const fileUpload = require('express-fileupload');
var router = express.Router();

router.get('/', async function (req, res, next) {
  if (req.session.userID == undefined) { res.redirect('/') }
  else {
    res.render('upload_activity_form');
  }
});

router.use(fileUpload());

router.post('/', function (req, res) {

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  sampleFile = req.files.activity;
  var data = JSON.parse(sampleFile.data);

  query = "SELECT * FROM Activity WHERE activityUser='" + req.session.userID + "' ORDER BY Activity.rowid DESC;";
  activities =  new Promise(function (resolve, reject) {
    db.run(query,
        function (err) {
            if (err) reject(err.message)
            else resolve(true)
        })
  })

  date = data["activity"]["date"]
  description = data["activity"]["description"]
  time = data["data"][0]["time"],
  activityUser = req.session.userID,
  basicData = [date, time, activityUser]

  var idActivity = 1; // TO DETERMINE
  /*
  values = [date, description]
  query = "SELECT ROWID FROM Activity WHERE date = ?, description = ?";
  id = new Promise(function (resolve, reject) {
    db.run(query, values,
        function (err) {
            if (err) reject(err.message)
            else resolve(true)
        })
      })
    */

  for (let i = 0; i < data["data"].length; i++) {
    let time = data["data"][i]["time"]
    let cardio = data["data"][i]["cardio_frequency"]
    let latitude = data["data"][i]["latitude"]
    let longitude = data["data"][i]["longitude"]
    let altitude = data["data"][i]["altitude"]
    let donnee = [time, cardio, latitude, longitude, altitude, idActivity]
    activity_entry_dao.insert(donnee);
  }

});

module.exports = router;
